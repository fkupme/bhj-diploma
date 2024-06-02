/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
	/**
	 * Производит авторизацию с помощью User.login
	 * После успешной авторизации, сбрасывает форму,
	 * устанавливает состояние App.setState( 'user-logged' ) и
	 * закрывает окно, в котором находится форма
	 * */
	// проверка response в User
	onSubmit(data) {
		User.login(data, (req) => {
			console.log(req, data);
			this.element.reset();
			App.setState('user-logged');
			Modal.close('modal-login');
		});
	}
}