import dialogPolyfill from "dialog-polyfill";

global.HTMLDialogElement = global.HTMLDialogElement || dialogPolyfill.Dialog;

dialogPolyfill.registerDialog =
  dialogPolyfill.registerDialog ||
  function (dialog) {
    if (!dialog.showModal) {
      dialog.showModal = function () {
        this.setAttribute("open", "open");
      };
    }
    if (!dialog.close) {
      dialog.close = function () {
        this.removeAttribute("open");
      };
    }
  };
