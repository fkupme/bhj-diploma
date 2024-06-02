/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
	static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
	window.localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
	window.localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
	return JSON.parse(window.localStorage.getItem('user'))
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
	if(!this.current()){
		return;
	}
	createRequest({
		url: this.URL + '/current',
		method: 'GET',
		responseType: 'json',
		data: this.current(),
		callback
	  });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (response) => {
		console.log(response);
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
	createRequest({
		url: this.URL + '/register',
		method: 'PUT',
		responseType: 'json',
		data,
		callback: (response) => {
		  if (response && response.user) {
			this.setCurrent(response.user);
		  }
		  callback(response);
		}
	  });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {

	createRequest({
		url: this.URL + '/logout',
		method: 'DELETE',
		responseType: 'json',
		data: this.current(),
		callback: (response) => {
			console.log(response);
		  if (response && response.user) {
			this.unsetCurrent();
		  }
		  callback(response);
		}
	  });
  }
}
