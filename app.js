class Calendar extends Date {
    constructor() {
        super()
        this.state = {
            DOMYear: document.querySelector('#year h1')
        }
        this.setUpdate()
    }

    getFormattedMonth() {
        let month = ['Janvier', 'Fevrier', 'Mars',
                     'Avril', 'Mai', 'Juin', 'Juillet', 
                     'Aout', 'Septembre', 'Octobre', 'Novembre','Decembre']
        return month[this.getMonth()]
    }

    nextMonth() {
        this.setMonth(this.getMonth() + 1)
        this.setUpdate()
    }

    prevMonth() {
        this.setMonth(this.getMonth() - 1)
        this.setUpdate()
    }


    setUpdate() {
        this.state.DOMYear.innerHTML = this.getFormattedMonth() + ' ' +  this.getFullYear()
    }
}


let date = new Calendar()


function nextMonth() {
    date.nextMonth()
}

function prevMonth() {
    date.prevMonth()
}