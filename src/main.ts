import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket, IBasket } from './components/view/Basket';
import { CatalogCard } from './components/view/Card/CatalogCard';
import { DetailedCard } from './components/view/Card/DetailedCard';
import { ContactsForm } from './components/view/Form/ContactsForm';
import { OrderForm } from './components/view/Form/OrderForm';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { ShopApi } from './services/ShopApi';
import { IApiProductList, IBuyer, IOrderData, IProduct, TByuerFields, TPayment } from './types';
import { API_URL, categoryMap } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);
const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const catalogElements: HTMLElement[] = [];

const galleryElement = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(events, galleryElement);

const modalElement = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalElement);

const headerElement = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerElement);

const cart = new Cart(events);
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basket = new Basket(events, basketTemplate);

const buyer = new Buyer(events);

let currentDetailedCard: DetailedCard | null;

let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;
const successTemplate = cloneTemplate<HTMLElement>('#success');
const success = new Success(events, successTemplate);
 
events.on('catalog:updated', (data: { products: IProduct[] }) => {
  catalogElements.length = 0;

  data.products.forEach(item => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const catalogCard = new CatalogCard(events, cardElement, categoryMap);
    catalogElements.push(catalogCard.render(item));
  })

  gallery.render({ catalog: catalogElements });
})

events.on('catalog:select', (data: { id: string}) => {
  const selectedItem = catalog.getProductById(data.id);
  if (selectedItem) {
    catalog.setDetailedProduct(selectedItem);
  }
})

events.on('catalog:detailedUpdated', (data: { detailedProduct: IProduct}) => {
  const detailedCardTemplate = cloneTemplate<HTMLElement>('#card-preview');
  currentDetailedCard = new DetailedCard(events, detailedCardTemplate, categoryMap);
  const cardContent = currentDetailedCard.render({
    ...data.detailedProduct,
    addButtonText: data.detailedProduct.price === null
      ? 'Недоступно'
      : cart.checkItemInCartById(data.detailedProduct.id) ? 'Удалить из корзины' : 'В корзину',
    addButtonDisabled: data.detailedProduct.price === null
  });

  
  modal.render({data: cardContent});
  modal.isOpen = true;
})

events.on('modal:close', () => {
  modal.isOpen = false;
  currentDetailedCard = null;
  currentOrderForm = null;
  currentContactsForm = null;
})

events.on('basket:open', () => {
  const cartData: IBasket = {
    totalPrice: cart.getCartItemsPrice(),
    items: cart.getCartItems().map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      index: index + 1,
    }))
  }
  basket.render(cartData);

  modal.render({ data: basket.render(cartData) });
  modal.isOpen = true;
})

events.on('basket:addCard', (data: { id: string }) => {
  const item = catalog.getProductById(data.id);
  if (!item) {
    console.error('Продукт не найден по id:', data.id);
    return;
  }
  if (item.price === null) {
    return;
  }

  const isInBasket = cart.checkItemInCartById(data.id)
  if (isInBasket) {
    cart.removeProductFromCart(data.id);
  } else {
    cart.addProductInCart(item);
  }


  if (currentDetailedCard) {
    currentDetailedCard.addButtonText = isInBasket ? 'В корзину' : 'Удалить из корзины';
    currentDetailedCard.addButtonDisabled = false;
  }

  header.counter = cart.getCartItemsCount();
  modal.isOpen = false;
})

events.on('basket:deleteCard', (data: { id: string }) => {
  cart.removeProductFromCart(data.id);
})

events.on('cart:updated', (data: { items: IProduct[], total: number, count: number; }) => {
  const cartData: IBasket = {
    items: data.items.map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      index: index + 1
    })),
    totalPrice: data.total,
  };

  basket.render(cartData);
  header.counter = data.count;
})

events.on('order:paymentChange', (data: { payment: TPayment }) => {
  buyer.setInfo('payment', data.payment);
});

events.on('form:input', (data: { field: TByuerFields; value: string }) => {
  buyer.setInfo(data.field, data.value);
});

events.on('form:submit', () => {
  if (currentOrderForm) {
    const validation = buyer.validateOrder();
    if (!validation.valid) return;
    const contactsTemplate = cloneTemplate<HTMLElement>('#contacts');
    currentContactsForm = new ContactsForm(events, contactsTemplate);
    const contactsVal = buyer.validateContacts();
    const initialErrors = Object.values(contactsVal.errors).filter((e): e is string => Boolean(e));
    const contactsRendered = currentContactsForm.render({
      ...buyer.getInfo(),
      valid: contactsVal.valid,
      errors: initialErrors
    });
    modal.render({ data: contactsRendered });
    currentOrderForm = null;
    return;
  }

  if (currentContactsForm) {
    const contactsVal = buyer.validateContacts();
    if (!contactsVal.valid) return;

    const fullValidation = buyer.validate();
    if (!fullValidation.valid) return;

    const orderData: IOrderData = {
      ...buyer.getInfo(),
      total: cart.getCartItemsPrice(),
      items: cart.getCartItems().map(item => item.id)
    };
    shopApi.submitOrder(orderData)
      .then(() => {
        success.total = orderData.total;
        modal.render({ data: success.render() });
        cart.clearCart();
        buyer.clearInfo();
        currentContactsForm = null;
      })
      .catch(error => console.error('Ошибка заказа:', error));
    return;
  }
});

events.on('buyer:updated', (buyerData: IBuyer) => {
  if (currentOrderForm) {
    const validation = buyer.validateOrder();
    currentOrderForm.render({
      ...buyerData,
      valid: validation.valid,
      errors: validation.errors 
    });
  } else if (currentContactsForm) {
    const validation = buyer.validateContacts();
    const errors: string[] = Object.values(validation.errors).filter((e): e is string => Boolean(e));
    currentContactsForm.render({
      ...buyerData,
      valid: validation.valid,
      errors
    });
  }
});

events.on('basket:confirm', () => {
  const orderTemplate = cloneTemplate<HTMLElement>('#order');
  currentOrderForm = new OrderForm(events, orderTemplate);
  const orderRendered = currentOrderForm.render({
    ...buyer.getInfo(),
    ...buyer.validateOrder()
  });
  modal.render({ data: orderRendered });
  modal.isOpen = true;
  currentContactsForm = null;
});

events.on('success:confirm', () => {
  modal.isOpen = false;
});

shopApi.getProductList()
  .then((response: IApiProductList) => {
    if (!Array.isArray(response.items)) {
      throw new Error('API вернул некорректные данные')
    }
    catalog.setProductCatalog(response.items);

    console.log('Каталог товаров из API:', catalog.getProductCatalog());
  })
