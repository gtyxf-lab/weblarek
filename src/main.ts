import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { ShopApi } from './services/ShopApi';
import { IProduct, TPayment } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// модель Каталог продуктов
console.log('Модель - Каталог продуктов');

const productsModel = new ProductCatalog();

productsModel.setProductCatalog(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProductCatalog());
console.log('Товар - "Мамка-Таймер": ', productsModel.getProductById("b06cde61-912f-4663-9751-09956c0eed67"));

console.log('Получаем товар для подробного отображения, до того как его установили: ', productsModel.getDetailedProduct());
const randomItem: IProduct = apiProducts.items[Math.floor(Math.random() * apiProducts.items.length)];
console.log(`Ставим товар для подробного отображения: ${randomItem.title}`, productsModel.setDetailedProduct(randomItem));
console.log('Получаем товар для подробного отображения: ', productsModel.getDetailedProduct());

// модель Корзина
console.log(`\n\nМодель - Корзина`);

const cartModel = new Cart();

apiProducts.items.forEach(product => {
  console.log(`Добавляем ${product.title} в корзину;`);
  cartModel.addProductInCart(product);
});
console.log(`Есть ли ${randomItem.title} в козрине? - ${cartModel.checkItemInCartById(randomItem.id)}\n
А 'случайныйID'? - ${cartModel.checkItemInCartById('случайныйID')}`);

console.log('Получаем товары из корзины: ', cartModel.getCartItems());
console.log(`Удаляем "${randomItem.title}" из корзины`, cartModel.removeProductFromCart(randomItem.id));
console.log('Результат: ', cartModel.getCartItems());

console.log(`Стоимость ${cartModel.getCartItemsCount()} товаров в корзине = ${cartModel.getCartItemsPrice()}`);
console.log('Очищаем корзину и смотрим на результат: ', cartModel.clearCart(), cartModel.getCartItems())

//модель Покупатель
console.log(`\n\nМодель - Покупатель`);

const userModel = new Buyer();
const someUser = {
  payment: 'cash' as TPayment,
  email: 'someEmail@ex.ru',
  phone: '+71234567890',
  address: 'г. Такой, ул. Такая, д. 1, кв. 5'
}
userModel.setInfo('payment', someUser.payment);
userModel.setInfo('email', someUser.email);
userModel.setInfo('phone', someUser.phone);
userModel.setInfo('address', someUser.address);
console.log('Первый покупатель: ', userModel.getInfo());

console.log(`Валидны ли данные? - `, userModel.validate());

userModel.clearInfo();
console.log('Очистили поля и смотрим резульат:', userModel.getInfo());

console.log(`Валидны ли данные? - `, userModel.validate());

//Провека работы классов апи
console.log(`\n\nПроверка работы ShopApi`);
const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);
const testProductModel = new ProductCatalog();

shopApi.getProductList()
  .then((products: IProduct[]) => {
    testProductModel.setProductCatalog(products);
    console.log('Каталог товаров полученный из API:', testProductModel.getProductCatalog());
  })

const events = new EventEmitter();

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(events, galleryContainer);

const testItems: HTMLElement[] = [
  document.createElement('div'),
  document.createElement('div')
];

testItems[0].classList.add('card');
testItems[0].dataset.id = '1';
testItems[0].textContent = 'Карточка 1';

testItems[1].classList.add('card');
testItems[1].dataset.id = '2';
testItems[1].textContent = 'Карточка 2';

gallery.render({ catalog: testItems });
// events.on('catalog:select', (data: IProduct) => {
//   console.log(`Клик на карточку с id ${data.id}`);
// })

const headerElement = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerElement);
header.counter = 3;
events.on('cart:open', () => {
  console.log('Корзина открыта');
})

const modalContainer = document.querySelector('.modal') as HTMLElement;

const modal = new Modal(events, modalContainer);

const testContent = document.createElement('div');
testContent.textContent = 'Тестовый контент модалки';
testContent.style.border = '1px solid white';

modal.content = testContent;
// modal.render({data: testContent});

// document.body.appendChild(modalContainer);
events.on('modal:close', () => {console.log('Закрыть модалку');})

const template = document.querySelector('#success') as HTMLTemplateElement;
const cloned = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
console.log(cloned);
const successView = new Success(events, cloned);

successView.render({ total: 500 });
document.querySelector('.modal__content')?.appendChild(cloned);
events.on('success:confirm', () => {console.log('Закрыть модалку');})