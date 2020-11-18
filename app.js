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
            this.state.events.push({
                date: ev.dataset.date,
                type: ev.dataset.type
            })
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
        // date form the cell
        let date = new Date(years, month, day)
        // now reference
        let now = new Date()
        
        now.setHours(0,0,0,0)
        
        let firstDay = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - this.getFormattedDay(now.getDay())))
        let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 6)

        console.log(lastDay)

        if(date.getTime() >= firstDay.getTime() && date.getTime() <= lastDay.getTime()) {
            return true
        }
        //console.log(day + '/' + month + '/' + years)
       return false
    }

    isDay(day, month, years) {
          // date form the cell
          let date = new Date(years, month, day)
          // now reference
          let now = new Date()
          now.setHours(0,0,0,0)

          if(date.getTime() === now.getTime()) {
              return true
          }
          return false
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
        // reset the grid
        this.state.DOMDays.innerHTML = '' 
        let currentMonth = {
            start: this.getStartOfMonth(),
            end: this.getEndOfMonth()
        }
        // li container (array)
        let lis = []
        let prevMonth = this.getEndOfMonth(this.getMonth() - 1) 

        // number of cell who need to be created for fill the grid
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
        // generate li for the current month ex: 0-31 (HTMLLIELMENT)
        this.buildMonth(currentMonth.end.posInMonth).forEach(li => {
            lis.push(li)
        })
        // ul container
        let grid = []
        // number of item missed
        let p = 0
        for(let i = 0; i < 6; i++) {
            let ul = document.createElement('ul')
            grid.push(ul)
            for(let e = 0; e < 7; e++) {
                // determine the number of item missing in grid
                if(lis[p] !== undefined) 
                    grid[i].appendChild(lis[p])
                p++;
            }
        }

        // fix the missing cell in grid
        this.buildEnd(grid, this.getStartOfMonth(this.getMonth() + 1))

        // appending the grid to the DOM element
        grid.forEach(ul => {
            this.state.DOMDays.appendChild(ul)
        })

    }   
    
    // creator
    createCell(isMonths, day, months) {  
        // cell  
        let li = document.createElement('li')
        li.className = (isMonths) ? 'c-m' : 'o-m'

        // cell container
        let div = document.createElement('div')
        // day number
        let p = document.createElement('p')
        // pill container 
        let pills = document.createElement('div')
        
        p.innerHTML = day
        div.appendChild(p)
        this.state.events.forEach((ev, index) => {
            // get array of the string slitted at /
            let obj = ev.date.split('/')
            if(obj[0] == day && obj[1] - 1 == months && obj[2] == this.getFullYear()) {
                // pill
                let pill = document.createElement('p')
                pill.setAttribute('style', ev.type)
                // add class for has event
                li.className = (!li.className.includes('has-event')) ? li.className + ' has-event' : li.className + '';
                // add to pill container
                pills.appendChild(pill)
                // add to cell container
                div.appendChild(pills)

                // assessor of this
                let _this = this
                // when click on has-event
                li.addEventListener('click', function(e) {
                    let height = 0
                    let parent = _this.state.DOMEvent[index]
                    for(let i = 0; i < index; i++) {
                       height +=  _this.state.DOMEvent[i].scrollHeight
                    }
                    _this.state.DOMEvent[index].parentElement.scrollTo({
                        top: height,
                        left: 0,
                        behavior: 'smooth'
                      })
                    _this.state.DOMEvent[index].className = "active"
                    setTimeout(() => {
                        _this.state.DOMEvent[index].removeAttribute('class')
                    }, 1000);
                })
            } 
        })

        // check if day is in current week
        li.className = li.className + ((this.isCurrentWeek(day, months, this.getFullYear())) ? ' c-w' : '');
        // if is today
        li.className = li.className + ((this.isDay(day, months, this.getFullYear()) ? ' today' : ''));
        // add cell container to cell
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
console.log(date)