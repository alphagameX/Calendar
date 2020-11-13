class Calendar extends Date {
    constructor() {
        super()
        this.state = {
            DOMYear: document.querySelector('#year h1'),
            DOMDays: document.querySelector('#day'),
            DOMEvent: document.querySelectorAll('.group li'),
            events: [],
            now: new Date()
        }
        this.state.DOMEvent.forEach(ev => {
            this.state.events.push(ev.dataset.date)
        })
        this.setUpdate()
    }

    // getter
    getFormattedMonth() {
        let month = ['Janvier', 'Fevrier', 'Mars',
                     'Avril', 'Mai', 'Juin', 'Juillet', 
                     'Aout', 'Septembre', 'Octobre', 'Novembre','Decembre']
        return month[this.getMonth()]
    }


    getEndOfMonth(month = this.getMonth(), years = this.getFullYear()) {
      let date = new Date()
      date.setMonth(month + 1)
      date.setFullYear(years)
      date.setDate(1)
      date.setDate(date.getDate() - 1)
      return {
          posInWeek : this.getFormattedDay(date.getDay()),
          posInMonth: date.getDate()
      }
    }

    getStartOfMonth(month = this.getMonth(), years = this.getFullYear()) {
        let date = new Date()
        date.setMonth(month)
        date.setFullYear(years)
        date.setDate(1)
        return {
            posInWeek: this.getFormattedDay(date.getDay()),
            posInMonth: date.getDate()
        }
    }

    getFormattedDay(day) {
        switch (day) {
            case 0: return 6;
            case 1: return 0;
            case 2: return 1;
            case 3: return 2;
            case 4: return 3;
            case 5: return 4;
            case 6: return 5;
        }
    }

    // credential 
    isCurrentWeek(day, month, years) {
        let startWeek = (this.getDate() - this.getDay()) + 1
        let endWeek = startWeek + 6
        return (day >= startWeek && day <= endWeek && month === this.state.now.getMonth() && years === this.state.now.getFullYear()) ? true : false
    }
    
    // builder
    buildMonth(posMonth) {
        let lis = []
        let i = 1
        let month = this.getMonth()
        while(i <= posMonth) {
            let newCell = this.createCell(true, i, month)
            lis.push(newCell)
            i++
        }
        return lis
    }
    buildEnd(grid, nextMonth) {

        let levelMissing = []
        grid.forEach((ul, i) => {
            let child = Array.from(ul.children)
            for(let e = 0; e < 7; e++) {
               if(child[e] === undefined) {
                   levelMissing.push(grid[i])
                   return;
               }
            }
        })
        let p = nextMonth.posInMonth
        for(let e = 0; e < levelMissing.length; e++) {
            let child = Array.from(levelMissing[e].children)
            for(let i = 0; i < 7; i++) {
                if(child[i] === undefined) {
                    let newCell = this.createCell(false, p, this.getMonth() + 1)
                    levelMissing[e].appendChild(newCell)
                    p++
                }
            }
        }
    }

    buildGrid() { 
        this.state.DOMDays.innerHTML = '' 
        let currentMonth = {
            start: this.getStartOfMonth(),
            end: this.getEndOfMonth()
        }
        let lis = []
        let prevMonth = this.getEndOfMonth(this.getMonth() - 1) 

        let DiffPrev = prevMonth.posInMonth - (currentMonth.start.posInWeek - 1)
        let DiffLis = []
        while(DiffPrev <= prevMonth.posInMonth) {
            let newCell = this.createCell(false, DiffPrev, this.getMonth() - 1)
            DiffLis.push(newCell)
            DiffPrev += 1
        }
        if(DiffLis.length > 0) {
            DiffLis.forEach(li => {
                lis.push(li)
            })
        }
        this.buildMonth(currentMonth.end.posInMonth).forEach(li => {
            lis.push(li)
        })
        let grid = []
        let p = 0
        for(let i = 0; i < 6; i++) {
            let ul = document.createElement('ul')
            grid.push(ul)
            for(let e = 0; e < 7; e++) {
                if(lis[p] !== undefined) 
                    grid[i].appendChild(lis[p])
                p++;
            }
        }
        this.buildEnd(grid, this.getStartOfMonth(this.getMonth() + 1))
        grid.forEach(ul => {
            this.state.DOMDays.appendChild(ul)
        })

    }   
    
    // creator
    createCell(isMonths, content, months) {    
        let li = document.createElement('li')
        li.className = (isMonths) ? 'current' : 'other'
        if(this.isCurrentWeek(content, months, this.getFullYear()) === true) {
            li.className = li.className + ' weeked'
        }
        let div = document.createElement('div')
        let pills = document.createElement('div')
        let p = document.createElement('p')
        p.innerHTML = content
        div.appendChild(p)
        this.state.events.forEach((ev, index) => {
            let obj = ev.split('/')
            if(parseInt(obj[0]) === parseInt(content) && (parseInt(obj[1]) - 1) === parseInt(months) && parseInt(obj[2]) === parseInt(this.getFullYear())) {
                let o = document.createElement('p')
                li.className = li.className + ' has-event'
                pills.appendChild(o)
                div.appendChild(pills)
                let _this = this
                li.addEventListener('click', function(e) {
                    let parent = _this.state.DOMEvent[index].parentElement
                    console.log(parent)
                    
                })
            } 
        })
        li.appendChild(div)
        return li
    }

    // fonctionnal
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
        this.buildGrid()
    }
} 


let date = new Calendar()
