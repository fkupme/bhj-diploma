/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
	/**
	 * Устанавливает текущий элемент в свойство element
	 * Регистрирует обработчики событий с помощью
	 * AccountsWidget.registerEvents()
	 * Вызывает AccountsWidget.update() для получения
	 * списка счетов и последующего отображения
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('AsyncForm element must be defined')
		}
		this.element = element;
		this.button = this.element.querySelector('.create-account')
		this.accounts = Array.from(this.element.querySelectorAll('.account'))

		this.registerEvents();
		this.update();
	}

	/**
	 * При нажатии на .create-account открывает окно
	 * #modal-new-account для создания нового счёта
	 * При нажатии на один из существующих счетов
	 * (которые отображены в боковой колонке),
	 * вызывает AccountsWidget.onSelectAccount()
	 * */
	registerEvents() {
		this.button.addEventListener('click', (event) => {
			event.preventDefault();
			App.getModal('createAccount').open();
		})
		if (this.accounts.length) {
			this.accounts.forEach(item => item.addEventListener('click', (event) => {
				event.preventDefault();
				AccountsWidget.onSelectAccount(item)
			}));
		}
	}

	/**
	 * Метод доступен только авторизованным пользователям
	 * (User.current()).
	 * Если пользователь авторизован, необходимо
	 * получить список счетов через Account.list(). При
	 * успешном ответе необходимо очистить список ранее
	 * отображённых счетов через AccountsWidget.clear().
	 * Отображает список полученных счетов с помощью
	 * метода renderItem()
	 * */
	update() {
		const data = User.current();
		if (!data) {
			return;
		}
		Account.list(data, (resp) => {
			this.clear();
			this.renderItem(resp)
		})
	}

	/**
	 * Очищает список ранее отображённых счетов.
	 * Для этого необходимо удалять все элементы .account
	 * в боковой колонке
	 * */
	clear() {
		this.accounts.forEach(item => item.remove())
	}

	/**
	 * Срабатывает в момент выбора счёта
	 * Устанавливает текущему выбранному элементу счёта
	 * класс .active. Удаляет ранее выбранному элементу
	 * счёта класс .active.
	 * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
	 * */
	onSelectAccount(element) {
		element.classlist.add('active');
		this.accounts.find(item => item.classlist.contains('active')).remove('active');
		App.showPage('transactions', { account_id: element.getAttribute('data-id') });
	}

	/**
	 * Возвращает HTML-код счёта для последующего
	 * отображения в боковой колонке.
	 * item - объект с данными о счёте
	 * */
	getAccountHTML(item) {
		// const li = document.createElement('li');
		// li.setAttribute('data-id', item.id);
		// li.classList.add('active', 'account');
		// const a = document.createElement('a');
		// a.setAttribute('href', '#');
		// const name = document.createElement('span');
		// const sum = document.createElement('span');
		return `<li class="active account" data-id=${item.id}>
		<a href="#">
			<span>${item.name}</span> /
			<span>${item.sum} ₽</span>
		</a>
		</li>`
	}

	/**
	 * Получает массив с информацией о счетах.
	 * Отображает полученный с помощью метода
	 * AccountsWidget.getAccountHTML HTML-код элемента
	 * и добавляет его внутрь элемента виджета
	 * */
	renderItem(data) {
		if (!data) {
			return;
		};
		data.forEach(item =>{
			this.element.innerHTML += this.getAccountHTML(item);
		})
	}
}
