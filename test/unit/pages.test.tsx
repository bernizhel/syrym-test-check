import React from "react";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

function appRouteInstance(route: string) {
  const basename = "/";
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
  const application = (
    <MemoryRouter initialEntries={[`${basename}${route}`]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );
  return render(application);
}

describe("Тестирование страниц", () => {
  function testRoute(route: string) {
    it(`В магазине должна быть страница: ${route}`, () => {
      const { container } = appRouteInstance(route === "Home" ? "" : route.toLowerCase());
      const pageContainer = container.querySelector(`.${route}`);
      expect(pageContainer).not.toBe(null);
    });
  }

  const routes = ["Home", "Catalog", "Delivery", "Contacts", "Cart"];

  routes.forEach((route) => {
    testRoute(route);
  });
});
