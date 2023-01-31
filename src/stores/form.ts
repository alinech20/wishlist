import type { WLFormSubmissionMessage } from "@/types/forms.types";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useFormStore = defineStore("form", () => {
  // #region Form submission status (getter and setter)
  const formProcessing = ref<boolean>(false);

  /**
   * Sets the value of formProcessing
   * true -> form is being submitted
   * false -> form is not being submitted
   *
   * @param { boolean } v Value to assign to the state
   */
  const setFormProcessing: Function = (v: boolean): boolean =>
    (formProcessing.value = v);
  // #endregion

  // #region Form message status (getter and setter)
  const showFormProcessingMessage = ref<boolean>(false);

  /**
   * Sets the value of showFormProcessingMessage
   * true -> show submission status message
   * false -> don't show submission status message
   *
   * @param { boolean } v Value to assign to the state
   */
  const setShowFormProcessingMessage: Function = (v: boolean): boolean =>
    (showFormProcessingMessage.value = v);

  const formProcessingMessage = reactive<WLFormSubmissionMessage>({
    type: undefined,
    message: "",
  });

  /**
   * Sets the form submission message
   *
   * @param { WLFormSubmissionMessage } msg The message object
   */
  const setFormProcessingMessage: Function = (
    msg: WLFormSubmissionMessage
  ): WLFormSubmissionMessage => {
    formProcessingMessage.type = msg.type;
    formProcessingMessage.message = msg.message;
    return formProcessingMessage;
  };
  // #endregion

  const hideFormMessage: Function = (timeout: number | null = null): void => {
    const defaultFormTimeout: number = 5000;
    const to = timeout || defaultFormTimeout;

    setFormProcessing(false);

    setTimeout(() => {
      setShowFormProcessingMessage(false);
      setFormProcessingMessage({
        type: undefined,
        message: "",
      });
    }, to);
  };

  const showFormMessage: Function = (
    msg: string | null = null
  ): WLFormSubmissionMessage => {
    setFormProcessing(true);
    setShowFormProcessingMessage(true);
    return setFormProcessingMessage({
      type: "pending",
      message: msg,
    });
  };

  return {
    formProcessing,
    showFormProcessingMessage,
    formProcessingMessage,
    setFormProcessingMessage,
    hideFormMessage,
    showFormMessage,
  };
});
