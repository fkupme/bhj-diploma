/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
	/**
	 * Вызывает родительский конструктор и
	 * метод renderAccountsList
	 * */
	constructor(element) {
		super(element)
		this.select = element.querySelector('.accounts-select')
		this.renderAccountsList();
	}

	/**
	 * Получает список счетов с помощью Account.list
	 * Обновляет в форме всплывающего окна выпадающий список
	 * */
	renderAccountsList() {
		const userFromLocalStorage = User.current()
		if(!userFromLocalStorage){
			return;
		};
		Account.list(userFromLocalStorage, (resp) =>{
			if(!resp || !resp.success) {
				return;
			}
			this.select.innerHTML += `<option value="${resp.id}">${resp.name}</option>`
		});
	}

	/**
	 * Создаёт новую транзакцию (доход или расход)
	 * с помощью Transaction.create. По успешному результату
	 * вызывает App.update(), сбрасывает форму и закрывает окно,
	 * в котором находится форма
	 * */
	onSubmit(data) {
		Transaction.create(data, (resp)=>{
			if (!resp.success) {
				return;
			}
			App.update();
		});
	}
}