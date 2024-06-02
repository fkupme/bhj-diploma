/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
	/**
	 * Устанавливает полученный элемент
	 * в свойство element.
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		this.element = element;
		this.incomeButton = this.element.querySelector('.create-income-button');
		this.expenseButton = this.element.querySelector('.create-expense-button');
		this.registerEvents();
	}
	/**
	 * Регистрирует обработчики нажатия на
	 * кнопки «Новый доход» и «Новый расход».
	 * При нажатии вызывает Modal.open() для
	 * экземпляра окна
	 * */
	registerEvents() {
		this.incomeButton.addEventListener('click', (event) => {
			event.preventDefault();
			App.getModal('newIncome').open();
		});
		this.expenseButton.addEventListener('click', (event) => {
			event.preventDefault();
			App.getModal('newExpense').open();
		});
	}
}
