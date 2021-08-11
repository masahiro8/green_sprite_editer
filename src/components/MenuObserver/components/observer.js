export const Observer = () => {
  let callbacks = {};
  let values = {};

  const setCallback = (key, callback) => {
    if (!(key in callbacks)) {
      callbacks[key] = [];
      values[key] = null;
    }
    callbacks.key.push(callback);
  };

  const publish = (key, value) => {
    values[key] = value;
    callbacks[key].forEach((callback) => {
      callback(values[key]);
    });
  };

  const getValues = () => {
    return values;
  };

  return {
    publish,
    setCallback,
    getValues
  };
};
