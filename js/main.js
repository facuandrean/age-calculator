const d = document;

const $date = d.querySelector('.date');
const $groups = d.querySelectorAll('.date-group');
const $button = d.querySelector('.calculate button *');
const $span_results_years = d.querySelector('.result .years');
const $span_results_months = d.querySelector('.result .months');
const $span_results_days = d.querySelector('.result .days');

function isValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    
    if (date.getMonth() + 1 !== month) {
        return false; // El mes no coincide con el valor proporcionado
    }
    
    if (date.getFullYear() !== year) {
        return false; // El año no coincide con el valor proporcionado
    }
    
    if (date.getDate() !== day) {
        return false; // El día no coincide con el valor proporcionado
    }
    
    return true; // La fecha es válida
}
    
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
  
function isValidDateWithLeapYear(year, month, day) {
    if (month === 2 && day === 29) {
        return isLeapYear(year);
    }
    
    return isValidDate(year, month, day);
}

function calculateElapsedTime(day, month, year) {
    let initial_date = new Date(year, month - 1, day);
    let actual_date = new Date();
  
    let elapsed_years = actual_date.getFullYear() - initial_date.getFullYear();
    let months_elapsed = actual_date.getMonth() - initial_date.getMonth();
    let days_passed = actual_date.getDate() - initial_date.getDate();
  
    if (months_elapsed < 0 || (months_elapsed === 0 && days_passed < 0)) {
        elapsed_years--;
        months_elapsed += 12;
    }
  
    if (days_passed < 0) {
      let last_day_of_the_previous_month = new Date(actual_date.getFullYear(), actual_date.getMonth(), 0).getDate();
      days_passed = last_day_of_the_previous_month + days_passed;
      months_elapsed--;
    }
  
    return {
      years: elapsed_years,
      months: months_elapsed,
      days: days_passed
    };
}
  

d.addEventListener('click', (e) => {

    if (e.target == $button) {

        // creamos las letiables para ir obteniendo la fecha ingresada.
        let day_entered = '';
        let month_entered = '';
        let year_entered = '';

        $groups.forEach(group => {

            const $span = group.querySelector('span'); // Obtener referencia al span dentro del grupo

            if (group.children[1].value == "") {

                if (!$span) { // Verificar si el span ya existe antes de crearlo
                    // no existe el span, entonces, lo creo.
                    const $newSpan = d.createElement('span');
                    $newSpan.id = group.children[1].id;
                    $newSpan.textContent = group.children[1].title;
                    group.children[0].classList.add('error-label');
                    group.children[1].classList.add('error-input');
                    group.appendChild($newSpan);
                }

            } else {

                group.children[0].classList.remove('error-label');
                group.children[1].classList.remove('error-input');

                if ($span) { // Verificar si el span existe antes de intentar eliminarlo
                    group.removeChild($span);
                }

                // tiene valor el input, por ende, controlo si ese valor es correcto.

                if (group.children[1].id == 'day') {
                    if (((group.children[1].value < 1) || (group.children[1].value > 31))) {
                        const $newSpanTwo = d.createElement('span');
                        $newSpanTwo.id = group.children[1].id;
                        $newSpanTwo.textContent = 'Must be a valid day';
                        group.children[0].classList.add('error-label');
                        group.children[1].classList.add('error-input');
                        group.appendChild($newSpanTwo);
                    } else {
                        group.children[0].classList.remove('error-label');
                        group.children[1].classList.remove('error-input');
                    }

                    // obtenemos el ultimo dia ingresado (correcto)
                    day_entered = group.children[1].value.toString();
                }

                if (group.children[1].id == 'month') {
                    if (((group.children[1].value < 1) || (group.children[1].value > 12))) {
                        const $newSpanTwo = d.createElement('span');
                        $newSpanTwo.id = group.children[1].id;
                        $newSpanTwo.textContent = 'Must be a valid month';
                        group.children[0].classList.add('error-label');
                        group.children[1].classList.add('error-input');
                        group.appendChild($newSpanTwo);
                    } else {
                        group.children[0].classList.remove('error-label');
                        group.children[1].classList.remove('error-input');
                    }

                    // obtenemos el ultimo mes ingresado (correcto)
                    month_entered = group.children[1].value.toString();
                }

                if (group.children[1].id == 'year') {

                    let date = new Date();
                    let array = date.toString().split(' ');
                    let year = parseInt(array[3]);

                    if (group.children[1].value > year) {
                        const $newSpanTwo = d.createElement('span');
                        $newSpanTwo.id = group.children[1].id;
                        $newSpanTwo.textContent = 'Must be in the past';
                        group.children[0].classList.add('error-label');
                        group.children[1].classList.add('error-input');
                        group.appendChild($newSpanTwo);
                    } else {
                        group.children[0].classList.remove('error-label');
                        group.children[1].classList.remove('error-input');
                    }

                    // obtenemos el ultimo año ingresado (correcto)
                    year_entered = group.children[1].value.toString();
                }

            }
        });

        // validamos cada value de cada input, pero ahora tenemos que validar que sea una fecha correcta.
        // ejemplo: que no se ponga un 30/2 porque febrero no tiene 30 dias.

        const $span = d.getElementById('date-span');

        if (!isValidDateWithLeapYear(parseInt(year_entered), parseInt(month_entered), parseInt(day_entered))) {

            if (!$span) {
                const $newSpan = d.createElement('span');
                $newSpan.id = 'date-span'
                $newSpan.textContent = 'Invalid date: it is not a leap year or that day does not exist.';
                $date.appendChild($newSpan)
            }

        } else {

            if ($span) { // Verificar si el span existe antes de intentar eliminarlo
                $date.removeChild($span);
            }

            // calculo cuantos años pasaron
            
            let elapsed_time = calculateElapsedTime(day_entered, month_entered, year_entered);

            // console.log(
            // "Han transcurrido " +
            //     elapsed_time.years +
            //     " años, " +
            //     elapsed_time.months +
            //     " meses y " +
            //     elapsed_time.days +
            //     " días."
            // );

            $span_results_years.innerHTML = elapsed_time.years;
            $span_results_months.innerHTML = elapsed_time.months;
            $span_results_days.innerHTML = elapsed_time.days;

            if (elapsed_time.years < 0) {
                $span_results_years.innerHTML = '--';
                $span_results_months.innerHTML = '--';
                $span_results_days.innerHTML = '--';
            }
            
        }

        
    }
})