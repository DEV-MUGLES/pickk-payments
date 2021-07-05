export const generateForm = (
  input: Record<string, unknown>,
  formId: string
): HTMLFormElement => {
  // 이미 존재하면 remove한다.
  document.getElementById(formId)?.remove();

  const fele = document.body.children[0];

  const form: HTMLFormElement = document.createElement('form');
  form.id = formId;
  form.method = 'POST';

  fele.parentNode!.insertBefore(form, fele);

  Object.entries(input).forEach(([name, value]) => {
    if (value == null) {
      return;
    }

    const input: HTMLInputElement = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value.toString();

    form.appendChild(input);
  });

  return form;
};

export const formToJson = <T = Record<string, string>>(
  form: HTMLFormElement
): T => {
  const result = {};
  form.querySelectorAll('input').forEach((ele) => {
    if (!ele.name) {
      return;
    }

    result[ele.name] = ele.value;
  });

  return result as T;
};
