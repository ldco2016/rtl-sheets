import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (celllId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const importBlock = `
      import { React, 
        createRoot, 
        user,
        act,
        cleanup,
        fireEvent,
        render as _render,
        renderHook,
        configure,
        getConfig,
        getDefaultNormalizer,
        getRoles,
        isInaccessible,
        logRoles,
        queries,
        queryHelpers,
        within,
        getQueriesForElement,
        findAllByLabelText,
        findByLabelText,
        getAllByLabelText,
        getByLabelText,
        queryAllByLabelText,
        queryByLabelText,
        findAllByPlaceholderText,
        findByPlaceholderText,
        getAllByPlaceholderText,
        getByPlaceholderText,
        queryAllByPlaceholderText,
        queryByPlaceholderText,
        findAllByText,
        findByText,
        getAllByText,
        getByText,
        queryAllByText,
        queryByText,
        findAllByDisplayValue,
        findByDisplayValue,
        getAllByDisplayValue,
        getByDisplayValue,
        queryAllByDisplayValue,
        queryByDisplayValue,
        findAllByAltText,
        findByAltText,
        getAllByAltText,
        queryAllByAltText,
        queryByAltText,
        findAllByTitle,
        findByTitle,
        getAllByTitle,
        getByTitle,
        queryAllByTitle,
        queryByTitle,
        findAllByRole,
        findByRole,
        getAllByRole,
        getByRole,
        queryAllByRole,
        queryByRole,
        findAllByTestId,
        findByTestId,
        getAllByTestId,
        getByTestId,
        queryAllByTestId,
        queryByTestId,
        buildQueries,
        getElementError,
        getMultipleElementsFoundError,
        makeFindQuery,
        makeGetAllQuery,
        makeSingleQuery,
        queryAllByAttribute,
        queryByAttribute,
        wrapAllByQueryWithSuggestion,
        wrapSingleQueryWithSuggestion,
        waitFor,
        waitForElementToBeRemoved,
        getNodeText,
        createEvent,
        screen,
        logDOM,
        prettyDOM,
        prettyFormat,
        getSuggestedQuery,
        jest
     } from 'rtl-deps@1.0.4';
     const _React = React;
     const { useState, useEffect, Fragment, memo, useMemo, useCallback, useContext, useDebugValue, useReducer, useRef } = _React;

     configure({
      getElementError(message, container) {
        if (!message) {
          return new Error(container.outerHTML)
        }
        return { rtlError: true, message };
      }
     });

     (async () => {


    `;

    const showFunc = `
      var _highlight = (el, color) => {
        if (!el.classList) {
          return
        }
        el.style.boxShadow = '0px 0px 4px 4px ' + color
      };
      var highlight = (el, color = '#FFF400') => {
        if (!el) {
          return;
        }
        if (Array.isArray(el)) {
          el.forEach((e) => _highlight(e, color));
        }
        _highlight(el, color);
      };

      var show = (value) => {
        const rootEl = document.querySelector('#root');
        const root = createRoot(rootEl);

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            root.render(value);
          } else {
            rootEl.innerHTML = JSON.stringify(value);
          }
        } else {
          rootEl.innerHTML = value;
        }
      };

      var test = async (description, cb) => {
        await cb();
      };
      var render = _render;
    `;
    const showFuncNoop = `
      var show = () => {}
      var highlight = () => {}
      var render = () => {}
      var test = () => {}
    `;
    const cumulativeCode = [];

    let seenCode = false;
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (!seenCode) {
          seenCode = true;
          cumulativeCode.push(importBlock);
        }

        if (c.id === celllId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(commentOutImports(c.content));
      }
      if (c.id === celllId) {
        cumulativeCode.push("})();");
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};

function commentOutImports(content: string): string {
  const importRegex = /^s*import .* from .*;$/gm;

  return content.replace(importRegex, (match) => "//" + match);
}
