import { screen } from "@testing-library/react";

import React from "react";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { render } from "@testing-library/react";

const appInstance = () => {
  const basename = "/";
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );
  return render(application);
};

export default appInstance;

describe("Тестирование общих требований", () => {
  it("шапка должна содержать ссылки на страницу магазина и корзины", () => {
    const { container } = appInstance();
    const navBar = container.querySelector("nav");
    const navLinks = navBar?.querySelectorAll(".nav-link");

    const linksToContain = ["/catalog", "/delivery", "/contacts", "/cart"];
    const linksContained: string[] = [];
    if (navLinks && navLinks.length > 0) {
      navLinks.forEach((link) => {
        if (link.hasAttribute("href")) {
          const href = link.getAttribute("href");
          if (href) {
            linksContained.push(href);
          }
        }
      });
    }
    expect(linksContained).toStrictEqual(linksToContain);
  });

  it("Название магазина в шапке должно быть ссылкой на главную страницу", () => {
    appInstance();
    const storeNameLink = screen.queryByText("Example store", { exact: true });

    expect(storeNameLink).not.toBe(null);
    expect(storeNameLink).toBeInstanceOf(HTMLAnchorElement);
    expect(storeNameLink?.getAttribute("href")).toBe("/");
  });
});
