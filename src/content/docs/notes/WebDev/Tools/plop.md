---
title: Plop - 前端建構工具
description: 提供快速生成程式碼或檔案的方式
sidebar:
  badge:
    text: 未整理
---

提供快速生成程式碼或檔案的方式

## 初始化

1. 安裝
   ```bash
   npm install --save-dev plop
   ```
2. 在 project root 建立 `plopfile.ts`

   ```js
   export default function (plop) {
     // create your generators here
     plop.setGenerator("basics", {
       description: "this is a skeleton plopfile",
       prompts: [], // array of inquirer prompts
       actions: [], // array of actions
     });
   }
   ```

## Plop File

- function 的第一個參數為 `plop` 物件，提供了 plop API
  ```js
  export default function (plop) {}
  ```
- `setGenerator(name, config)` 用來產生此 plopfile 的 generator
  - 在 terminal 執行 `plop` 的時候，會顯示所有的 generators
  - 範例 - 問一個問題並產生一個檔案
    ```js
    export default function (plop) {
      // controller generator
      plop.setGenerator("controller", {
        description: "application controller logic",
        prompts: [
          {
            type: "input",
            name: "name",
            message: "controller name please",
          },
        ],
        actions: [
          {
            type: "add",
            path: "src/{{name}}.js",
            templateFile: "plop-templates/controller.hbs",
          },
        ],
      });
    }
    ```
    > .hbs 為 [Handlebars](https://handlebarsjs.com/guide/) 的 Template 格式，會將取得的輸入傳入 template 中放入插槽，並把產生的檔案放進我們定義的 `path` 中

## 使用 Type Declaration

- 使用 TypeScript

  ```typescript
  // plopfile.ts
  import { NodePlopAPI } from "plop";

  export default function (plop: NodePlopAPI) {
    // plop generator code
  }
  ```

- 使用 type declarations
  ```js
  // plopfile.js
  export default function (
    /** @type {import('plop').NodePlopAPI} */
    plop
  ) {
    // plop generator code
  }
  ```

## 使用 CLI 來執行 plop

> Plop 使用了 [inquirer.js](https://github.com/SBoudrias/Inquirer.js) 來取得使用者輸入的資料，可以在官網查看能使用的 [prompt types](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md#prompt-types)

- 執行`plop` 並不帶入任何參數時，會列出所有能挑選使用的 generators，也可以執行 `plop [generatorName]` 來指定要觸發的 generator
- 如果沒有在 global 安裝 plop，則需要在 `package.json` 中設置 `script`
  ```json
  // package.json
  {
    "scripts": {
      "plop": "plop"
    }
  }
  ```
- 有幾種不同回答 prompt 的方式

  1. 一個一個 prompt 依序回答

     ```shell
     plop component
     What is the name of the component? button
     What is the type of the component? react
     ```

  2. 直接將 prompt 答案依序傳入 CLI ( [官方範例](https://media.giphy.com/media/3ov9jQ38ypmX4SuT60/giphy.gif) )
     > 可以用 `_` 略過問題，略過的問題會接著被詢問
     ```shell
     plop component button react
     ```
  3. 透過 prompt `name` 指定回應
     > 輸入 `--` 後，接著用 name 的方式指定要回答的問題，沒回答的問題會接著被詢問
     ```shell
     plop component -- --name button --type react
     ```

## 主要會用到的一些 Methods

> 以下是一些 plopfiles 中常用的 methods

- `setHelper(name:string, helper:Function):void`
  - 等同 handlebars 的 [`registerHelper`](https://handlebarsjs.com/guide/expressions.html#helpers)
  - 定義 helper functions 來放進 template 中使用
    ```js
    // plopfile.js
    export default function (plop) {
      plop.setHelper("upperCase", (txt) => txt.toUpperCase());
    }
    ```
    ```hbs
    <!-- xxx.hbs -->
    {{upperCase lastname}}
    ```
- `setPartial(name:string, template:string):void`

  - 等同 handlebars 的 [`registerPartial`](https://handlebarsjs.com/guide/#partials)
  - 定義直接引入的 partials 讓 template 能直接引用

    ```js
    // plopfile.js
    export default function (plop) {
      plop.setPartial("myTitlePartial", "<h1>{{titleCase name}}</h1>");
    }
    ```

    ```hbs
    <!-- xxx.hbs -->
    {{> myTitlePartial }}
    ```

- `setActionType(name:string, CustomAction):void`

  > [CustomAction](https://plopjs.com/documentation/#functionsignature-custom-action)

  - 定義用在 plopfiles 中的 action functions (類似於 `add` 或 `modfy`)

    ```js
    // plopfile.js
    export default function (plop) {
      plop.setActionType("doTheThing", function (answers, config, plop) {
        // do something
        doSomething(config.configProp);
        // if something went wrong
        throw "error message";
        // otherwise
        return "success status message";
      });

      // or do async things inside of an action
      plop.setActionType("doTheAsyncThing", function (answers, config, plop) {
        // do something
        return new Promise((resolve, reject) => {
          if (success) {
            resolve("success status message");
          } else {
            reject("error message");
          }
        });
      });

      // use the custom action
      plop.setGenerator("test", {
        prompts: [],
        actions: [
          {
            type: "doTheThing",
            configProp: "available from the config param",
          },
          {
            type: "doTheAsyncThing",
            speed: "slow",
          },
        ],
      });
    }
    ```

- `setPrompt(type:string, InquirerPrompt):void`

  - 用來建立除了 Inquirer 提供的 prompt 外的 plugins，詳細可以參考 [Inuirer 文件](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md#inquirerregisterpromptname-prompt) 和 plop 的一些 [客製化 prompts](https://github.com/plopjs/awesome-plop#inquirer-prompts)

    ```js
    // plopfile.js
    import autocompletePrompt from 'inquirer-autocomplete-prompt';
    export default function (plop) {
        plop.setPrompt('autocomplete', autocompletePrompt);
        plop.setGenerator('test', {
            prompts: [{
                type: 'autocomplete',
                ...
            }]
        });
    };

    ```

- `setGenerator(name:string, config:GeneratorConfig):PlopGenerator`

  - 設置 Generator 用
  - [GeneratorConfig](https://plopjs.com/documentation/#interface-generatorconfig) 需包含 `prompts` 和 `actions` (`description` 選填)
    - `description` : string - 一段對於此 Generator 在幹嘛的敘述
    - `prompts` : Array<[InquirerQuestion](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md/#question)> - 要問 User 的問題
    - `Actions` : Array<[ActionConfig](https://plopjs.com/documentation/#interface-actionconfig)> - 要執行的動作
  - [PlopGenerator](https://plopjs.com/documentation/#interface-plopgenerator) 包含 `1runPrompts` 和 `runActions`
  - 如果執行的動作會動態調整，使用 [dynamic actions array](https://plopjs.com/documentation/#using-a-dynamic-actions-array)

    ```js
    export default function (plop) {
      plop.setGenerator("test", {
        prompts: [
          {
            type: "confirm",
            name: "wantTacos",
            message: "Do you want tacos?",
          },
        ],
        actions: function (data) {
          var actions = [];

          if (data.wantTacos) {
            actions.push({
              type: "add",
              path: "folder/{{dashCase name}}.txt",
              templateFile: "templates/tacos.txt",
            });
          } else {
            actions.push({
              type: "add",
              path: "folder/{{dashCase name}}.txt",
              templateFile: "templates/burritos.txt",
            });
          }

          return actions;
        },
      });
    }
    ```

## 參考資料

- [Plop Documentation](https://plopjs.com/documentation)
- [plopjs-example](https://github.com/ru03/plopjs-example)
- [Plop: 三秒寫一個 component](https://ithelp.ithome.com.tw/articles/10201465)
