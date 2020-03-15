
class FrontApp {
  private container: string
  private content: string

  constructor(props: any) {
    this.container = props.el
    this.content =
      '<p style="margin-top:100px;font-weight:600;font-size:50px;text-align:center" >DOCKERIZED WEBPACK</p>'
  }

  mount() {
    window.addEventListener('DOMContentLoaded', (event: Event) => {
      const container: HTMLElement = document.getElementById(this.container)
      this.render(container)
    })
  }

  render(domElement: HTMLElement) {
    domElement.innerHTML = this.content
  }
}

new FrontApp({
  name: 'webpack app',
  el: 'app',
}).mount()
