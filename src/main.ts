import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/models/ProductCatalog';
import { CatalogCard } from './components/view/Card/CatalogCard';
import { Gallery } from './components/view/Gallery';
import './scss/styles.scss';
import { ShopApi } from './services/ShopApi';
import { IApiProductList, IProduct } from './types';
import { API_URL, categoryMap } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);
const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const catalogElements: HTMLElement[] = [];

const galleryElement = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(events, galleryElement);
 
events.on('catalog:updated', (data: { products: IProduct[] }) => {
  catalogElements.length = 0;

  data.products.forEach(item => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const catalogCard = new CatalogCard(events, cardElement, categoryMap);
    catalogElements.push(catalogCard.render(item));
  })

  gallery.render({ catalog: catalogElements });

  console.log('Массив карточек каталога:', catalogElements);
})

shopApi.getProductList()
  .then((response: IApiProductList) => {
    if (!Array.isArray(response.items)) {
      throw new Error('API вернул некорректные данные')
    }
    catalog.setProductCatalog(response.items);

    console.log('Каталог товаров из API:', catalog.getProductCatalog());
  })

