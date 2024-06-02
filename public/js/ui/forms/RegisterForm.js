/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  // проверка response в User
  onSubmit(data) {
	User.register(data, (req) => {
		console.log(req, data);
		this.element.reset();
		App.setState('user-logged');
		Modal.close('modal-register'); // ???
	});
  }
}