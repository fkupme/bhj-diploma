/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest();

	const { url, data, method, callback } = options;

	if (!url || !data || !method || !callback) {
		throw new Error(`Invalid request`);
	}

	const dataEnteries = Object.entries(data);

	xhr.responseType = 'json';
	xhr.addEventListener('load', (e) => {
		if (xhr.status === 200) {
			callback(xhr.response);
		}
	});

	if (method === 'GET') {
		let getURL = url + '?';

		dataEnteries.forEach((pair, index) => {
			const stringPair = `${pair[0]}=${pair[1]}`
			if (index === 0) {
				getURL += stringPair
			} else {
				getURL += '&' + stringPair
			}
		})

		try {
			xhr.open(method, getURL);
			xhr.send();
		} catch (error) {
			console.error(error)
		}

	} else {
		const formData = new FormData;

		dataEnteries.forEach(pair => formData.append(...pair))

		try {
			xhr.open(method, url);
			xhr.send(formData);
		} catch (error) {
			console.error(error)
		}

	}

};

createRequest({
	url: 'http://localhost:8000',
	data: { email: "demo@demo", password: "demo"},
	method: 'GET',
	callback: (response) => {
		console.log(response);
	}
});

createRequest({
	url: 'http://localhost:8000',
	data: { email: "demo@demo", password: "demo"},
	method: 'POST',
	callback: (response) => {
		console.log(response);
	}
});
