import { Api } from './components/base/Api';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { ProductCatalog } from './components/models/ProductCatalog';
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