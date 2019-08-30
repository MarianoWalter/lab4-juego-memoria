function crearGrilla() {
	let size = 4;
	let values = Array(size * size / 2).fill(0).map((i, index) => {
		return {
			valor: index,
			visible: false,
			adivinada: false,
		};
	});

	values = values.concat(values)
		.map(x => JSON.parse(JSON.stringify(x))) // Sino se duplica la referencia a un mismo objeto
		.sort(() => Math.random() - 0.5); // Ordenar aleatoriamente

	console.info({ values });

	let arr = [];

	// Ordenar los valores en una grilla (array de arrays)
	let cont = 0;
	values.forEach((v, i) => {
		arr[i % size] = arr[i % size] || [];
		arr[i % size][(cont) % size] = v;
		if (i % size === 3) {
			cont++;
		}
	});

	return arr;

}

/** @param {HTMLElement} cell */
function setClick(cell) {
	cell.addEventListener('click', function() {
		if (cell._celda.adivinada) {
			return;
		}

		if (adivina.actual === cell._celda) {
			return;
		}

		if (adivina.cont === 0) {
			adivina.actual = cell._celda;
		}

		adivina.cont++;
		cell.classList.add('ver');

		if (adivina.cont === 2) {
			if (adivina.actual.valor == cell._celda.valor) {
				cell._celda.adivinada = true;
				cell.classList.add('adivinada');
				adivina.actual.adivinada = true;
				adivina.actual.el.classList.add('adivinada');
			}

			adivina.cont = 0;
			setTimeout(() => {
				adivina.reset();
			}, 300);
		}
	});
}

let grilla = crearGrilla();
let tabla = document.getElementById('tabla');
let adivina = {
	cont: 0, // cliqueados
	actual: null,
	reset: function() {
		grilla.forEach(row => {
			row.forEach(cell => {
				if (!cell.adivinada) {
					cell.el.classList.remove('ver');
				}
			});
		});
	},
};

for (let row of grilla) {
	let rowEl = document.createElement('span');
	rowEl.classList.add('row');
	tabla.appendChild(rowEl);

	for (let cell of row) {
		let cellEl = document.createElement('span');
		cellEl.classList.add('cell');
		rowEl.appendChild(cellEl);

		let imgEl = document.createElement('img');
		imgEl.src = 'img/' + cell.valor + '.svg';
		cellEl.appendChild(imgEl);
		cellEl._celda = cell;
		cell.el = cellEl;
		setClick(cellEl);
	}

	tabla.appendChild(document.createElement('br'));
}
