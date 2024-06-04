/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) throw new Error("element must exist");
		this.element = element;
		this.removeAccountButton = this.element.querySelector('.remove-account');
		this.removeTransactionButton = this.element.querySelector('.transaction__remove');
		this.content = this.element.querySelector('.content');
		this.registerEvents();
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		this.render();
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		this.removeAccountButton.addEventListener('click', (event) => {
			event.preventDefault();
			TransactionsPage.removeAccount();
		});
		if (this.removeTransactionButton) {
			this.removeTransactionButton.addEventListener('click', (event) => {
				event.preventDefault();
				TransactionsPage.removeTransaction(this.removeTransactionButton.getAttribute('data-id'));
			});
		}
	}

	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
	 * либо обновляйте только виджет со счетами и формы создания дохода и расхода
	 * для обновления приложения
	 * */
	removeAccount() {
		const result = confirm('Вы действительно хотите удалить счет?');
		if (!result || !this.lastOptions) return;
		Account.remove(this.lastOptions, () => {
			App.updateWidgets();
			App.updateForm();
		});
		this.clear();
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */
	removeTransaction(id) {
		const result = confirm('Вы действительно хотите удалить транзакцию?');
		if (!result) return;
		
		Transaction.remove(id, () =>{
			App.update();
		});
	}

	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (!options) return;
		Account.get(options.account_id, (resp) => {
			this.lastOptions = options;
			this.renderTitle(resp.name);
		});
		Transaction.list(options.account_id, (resp) => {
			this.renderTransactions(resp);
		});
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([]);
		this.renderTitle('Название счёта');
		this.lastOptions = null
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(name) {
		this.element.querySelector('.content-title').textContent = name;
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
		const dateTime = date.split(' ')
		const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августф', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
		const splitDate = dateTime[0]
		splitDate = splitDate.split('-').reverse();
		let time = dateTime[1]
		time= time.slice(0, time.lastIndexOf(':')) 
		return `${splitDate[0]} ${months[splitDate[1]-1]} ${splitDate[2]} г. в ${time}`
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		`<div class="transaction transaction_expense row">
		<div class="col-md-7 transaction__details">
		  <div class="transaction__icon">
			  <span class="fa fa-money fa-2x"></span>
		  </div>
		  <div class="transaction__info">
			  <h4 class="transaction__title">${item.name}</h4>
			  <div class="transaction__date">${this.formatDate(item.created_at)}</div>
		  </div>
		</div>
		<div class="col-md-3">
		  <div class="transaction__summ">
			  ${item.sum} <span class="currency">₽</span>
		  </div>
		</div>
		<div class="col-md-2 transaction__controls">
			<!-- в data-id нужно поместить id -->
			<button class="btn btn-danger transaction__remove" data-id="${item.id}">
				<i class="fa fa-trash"></i>  
			</button>
		</div>
	</div>`
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(data) {
		data.forEach(item => this.content.innerHTML += this.getTransactionHTML(item));
	}
}