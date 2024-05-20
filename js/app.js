
// Builders
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}   
// Make the quote with the data
Seguro.prototype.cotizarSeguro = function() {
    /*
    1 = American 1.15
    2 = Asian 1.05
    3 = European 1.35
    */ 

    let cantidad;
    const base = 2000; 

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
    }

    // Read the year
    const diferencia = new Date().getFullYear() - this.year;
    // Each year that the difference is greater, the cost will reduce by 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;
    /*
    If the insurance is basic, it is multiplied by 30%
    If the insurance is complete, it is multiplied by 50%
    */
    if(this.tipo === 'basic') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    return cantidad;

}


function UI() {}

// Fill in year options
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Show error alerts
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    
    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correct');
    }
    
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insert into the HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

// Print the quote result
UI.prototype.mostrarResultado = (total, seguro) => {
    const { marca, year, tipo } = seguro;
    let textoMarca;

    switch(marca) {
        case '1':
            textoMarca = 'American';
            break;
        case '2':
            textoMarca = 'Asian';
            break;
        case '3':
            textoMarca = 'European';
            break;
    }

    // Create the result
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Your Summary  </p>
        <p class="font-bold">Brand: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Year: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Type: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;
    // const spinner = document.querySelector('#cargando img');
    // spinner.style.display = 'none';
    // resultado.appendChild(div);
    const resultadoDiv = document.querySelector('#resultado');

    // Show the spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';    // Remove the spinner
        resultadoDiv.appendChild(div);  // Show the result
    }, 3000);
}
// Instantiate UI    
const ui = new UI();


// ################### Events or EventsListeners
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();    // Llena el select con los años
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}


// ################### Functions
function cotizarSeguro(e) {
    e.preventDefault();
    // Read the selected brand
    const marca = document.querySelector('#marca').value;
    // Read the selected year
    const year = document.querySelector('#year').value;
    // Read the type of coverage
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('All fields are required', 'error');
        return;
    }
    ui.mostrarMensaje('quoting...', 'success');

    // Hide previous quotes
    const resultados = document.querySelector('#resultado div');
    if(resultados != null) {
        resultados.remove();
    }

    // Instantiate insurance
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    

    // Use the prototype that is going to be quoted
    ui.mostrarResultado(total, seguro);

    
}