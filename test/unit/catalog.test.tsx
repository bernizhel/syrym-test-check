import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import { ApplicationState, initStore } from "../../src/client/store";
import { CartState, Product } from "../../src/common/types";
import { ExampleApi } from "../../src/client/api";

import { render } from "@testing-library/react";
import { Action } from "../../src/client/store";
import { commerce } from "faker";
import { LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { MemoryRouter } from "react-router";
import { Store } from "redux";
import React from "react";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";

import { configureStore } from "@reduxjs/toolkit";

function catalogInstance(initState: ApplicationState, productId?: string) {
  const store = configureStore({ reducer: () => initState });

  const url = `/catalog/${productId ?? ""}`;
  const application = (
    <MemoryRouter initialEntries={[url]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );
  return render(application);
}

export const setupPage = (
  pagePath: string,
  index: number = -1,
  api: ExampleApi,
  cart: MockCartApi,
  store: Store<ApplicationState, Action>
) => {
  const application = (
    <MemoryRouter initialEntries={index !== -1 ? [`${pagePath}/${index}`] : [pagePath]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  return render(application);
};

export const CART_STATE: CartState = {
  0: {
    count: 1,
    name: "Unbranded Pizza",
    price: 640,
  },
  1: {
    count: 5,
    name: "Ergonomic Gloves",
    price: 220,
  },
  2: {
    count: 2,
    name: "Incredible Fish",
    price: 206,
  },
};

export class MockCartApi {
  state: CartState;
  constructor(state: CartState) {
    this.state = state;
  }
  getState(): CartState {
    try {
      const json = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return this.state;
    } catch {
      return {};
    }
  }

  setState(cart: CartState) {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  }
}

export function initializeProducts(): Product[] {
  return Array.from({ length: 10 }, (_, id) => ({
    id,
    name: `${commerce.productAdjective()} ${commerce.product()}`,
    description: commerce.productDescription(),
    price: Number(commerce.price()),
    color: commerce.color(),
    material: commerce.productMaterial(),
  }));
}

export default {
  MockCartApi,
  initializeProducts,
  setupPage,
  CART_STATE,
};

const BUG_ID = process.env.BUG_ID ? `?bug_id=${process.env.BUG_ID}` : "";

describe("Тестирование каталога", () => {
  it("В каталоге должны отображаться товары, список которых приходит с сервера", () => {
    const products = initializeProducts();
    const initState = {
      details: {},
      cart: {},
      products,
    };

    catalogInstance(initState);

    for (const product of products) {
      const productIdExist = screen.queryAllByTestId(product.id.toString());
      expect(productIdExist).not.toBe([]);
    }
  });

  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
    const products = initializeProducts();
    const initState = {
      details: {},
      cart: {},
      products,
    };

    catalogInstance(initState);

    for (const product of products) {
      const productIdContainer = screen.queryAllByTestId(product.id.toString())[0];
      expect(productIdContainer).toBeInTheDocument();

      const productName = productIdContainer.querySelector(".ProductItem-Name");
      expect(productName).toBeInTheDocument();
      expect(productName).toHaveTextContent(product.name);

      const productPrice = productIdContainer.querySelector(".ProductItem-Price");
      expect(productPrice).toBeInTheDocument();
      expect(productPrice).toHaveTextContent(product.price.toString());

      const productDetailsLink = productIdContainer.querySelector(".ProductItem-DetailsLink");
      expect(productDetailsLink).toBeInTheDocument();
      expect(productDetailsLink).toBeInstanceOf(HTMLAnchorElement);
      expect(productDetailsLink?.getAttribute("href")).toBe(`/catalog/${product.id}`);
    }
  });

  const testProductDescription = (product: Product, initState: ApplicationState) => {
    it(`На странице с подробной информацией продукта ${product.id} отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"`, () => {
      const { container } = catalogInstance(initState, product.id.toString());

      const productDetailsContainer = container.querySelector(".Product");
      expect(productDetailsContainer).toBeInTheDocument();

      const testField = (fieldName: string, expectedValue: string) => {
        const field = productDetailsContainer?.querySelector(`.ProductDetails-${fieldName}`);
        expect(field).toHaveTextContent(expectedValue);
      };

      const fieldsToTest = ["Name", "Description", "Price", "Color", "Material"];

      fieldsToTest.forEach((field) => {
        testField(field, product[field.toLowerCase() as keyof Product].toString());
      });

      testField("AddToCart", "Add to Cart");
    });
  };

  const products = initializeProducts();
  const initState = {
    details: products,
    cart: {},
    products,
  };
  for (const product of products) {
    testProductDescription(product, initState);
  }
});

describe("Если товар уже добавлен в корзину", () => {
  const products = initializeProducts();

  const idsInCart = [0, 1];
  const cart: CartState = {};

  idsInCart.forEach((id) => {
    cart[id] = {
      name: products[id].name,
      price: products[id].price,
      count: 1,
    };
  });

  const initState = {
    details: products,
    cart,
    products,
  };

  it("В каталоге должно отображаться сообщение об этом", () => {
    catalogInstance(initState);

    for (const id of idsInCart) {
      const productIdContainer = screen.queryAllByTestId(id.toString())[0];
      expect(productIdContainer).toBeInTheDocument();

      const cartBadge = productIdContainer.querySelector(".CartBadge");
      expect(cartBadge).toBeInTheDocument();
      expect(cartBadge).toHaveTextContent("Item in cart");
    }
  });

  it("На странице товара должно отображаться сообщение об этом", () => {
    for (const id of idsInCart) {
      const { container } = catalogInstance(initState, id.toString());

      const productIdContainer = container.querySelector(".Product");
      expect(productIdContainer).toBeInTheDocument();

      const cartBadge = productIdContainer?.querySelector(".CartBadge");
      expect(cartBadge).toBeInTheDocument();
      expect(cartBadge).toHaveTextContent("Item in cart");
    }
  });
});

describe("Перезагрузка страницы", () => {
  const { location } = window as any;

  beforeAll(() => {
    delete (window as any).location;
    (window as any).location = { reload: jest.fn() };
  });

  afterAll(() => {
    (window as any).location = location;
  });

  it("Содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(CART_STATE);
    const store = initStore(api, mockCartApi);

    let { getByTestId } = setupPage(`/cart${BUG_ID}`, -1, api, mockCartApi, store);

    window.location.reload();
    await waitFor(async () => {
      const ids = Object.keys(CART_STATE);
      for (const id in ids) {
        const product = getByTestId(`${id}`);
        expect(product).not.toBeNull();
        expect(product).toBeInTheDocument();
      }
    });
  });
});
