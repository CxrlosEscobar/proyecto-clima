const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e) {
    e.preventDefault()

    // Validar
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if(ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios')
        return
    }

    spinner() // Spinner de carga

    // Consultar la API
    setTimeout(() => {
        consultarAPI(ciudad, pais)
    }, 1500);
}

function mostrarError(mensaje) {
    const alertaExiste = document.querySelector('.alerta')

    if(!alertaExiste) {
        const alerta = document.createElement('DIV')
        alerta.classList.add('alerta')

        alerta.innerHTML = `
            <strong class= "font-bold">Error!</strong>
            <span class= "block">${mensaje}</span>
        `
        container.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {

    const appId = 'c3db78fa29f7025712706b8975f57bec'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML() // Limpiar HTML Previo
            if(datos.cod === '404') {
                mostrarError('Ciudad no encontrada')
                return
            }
            // Imprime la respuesta en el HTML
            mostrarClima(datos)
        })
}

function mostrarClima(datos) {
    console.log(datos)
    const { name, main: { temp, temp_max, temp_min, humidity} } = datos

    const centigrados = kelvinACentigrados(temp) // Grados kelvin
    const max = kelvinACentigrados(temp_max)
    const min = kelvinACentigrados(temp_min)

    const nombreCiudad = document.createElement('P')
    nombreCiudad.textContent = `Clima en ${name}`
    nombreCiudad.classList.add('nombre-ciudad')

    const actual = document.createElement('P')
    actual.innerHTML = `${centigrados} &#8451;`
    actual.classList.add('clima-actual')

    const humedad = document.createElement('P')
    humedad.innerHTML = `Humedad: ${humidity}`
    humedad.classList.add('humedad')

    const resultadoDiv = document.createElement('DIV')
    resultadoDiv.classList.add('resultado-div')
    resultadoDiv.appendChild(actual)

    const tempMaxima = document.createElement('P')
    tempMaxima.innerHTML = `Max: ${max} &#8451;`
    tempMaxima.classList.add('temp-maxima')

    const tempMinima = document.createElement('P')
    tempMinima.innerHTML = `Min: ${min} &#8451;`
    tempMinima.classList.add('temp-minima')

    resultado.appendChild(nombreCiudad)
    resultado.appendChild(actual)
    resultado.appendChild(tempMaxima)
    resultado.appendChild(tempMinima)
    resultado.appendChild(humedad)

    resultado.appendChild(resultadoDiv)
}

const kelvinACentigrados = grados => parseInt(grados - 273.15)


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {
    limpiarHTML()

    const divSpinner = document.createElement('DIV')
    divSpinner.classList.add('spinner')
    divSpinner.innerHTML = `
        <div class="cube1"></div>
        <div class="cube2"></div>
    `

    resultado.appendChild(divSpinner)
}