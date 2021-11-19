class HeaderComponent extends Component {
    _addEventListeners() {
        const buttons = document.querySelectorAll('.showComponent');
        buttons.forEach(button => {
            button.addEventListener('click', () => this.showComponent(button.dataset.component));
        });
    }

    showComponent(name) {
        this.callbacks.showComponent(name);
    }
}