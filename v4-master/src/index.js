import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

var todoItems = [];
todoItems.push({ index: 1, value: "learn react", done: false });
todoItems.push({ index: 2, value: "go shopping", done: true });
todoItems.push({ index: 3, value: "buy flowers", done: true });

class TodoList extends React.Component {
    render() {
        var items = this.props.items.map((item, index) => {
            return (
                <TodoListItem key={index} item={item} index={index} removeItem={this.props.removeItem} markTodoDone={this.props.markTodoDone} />
            );
        });
        return (
            <ul className="list-group"> {items} </ul>
        );
    }
}

class TodoListItem extends React.Component {
    constructor(props) {
        super(props);
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickDone = this.onClickDone.bind(this);
    }
    onClickClose() {
        var index = parseInt(this.props.index);
        this.props.removeItem(index);
    }
    onClickDone() {
        var index = parseInt(this.props.index);
        this.props.markTodoDone(index);
    }
    render() {
        var todoClass = this.props.item.done ?
            "done" : "undone";
        return (
            <li className="list-group-item ">
                <div className={todoClass}>
                    <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
                    {this.props.item.value}
                    <button type="button" className="close" onClick={this.onClickClose}>&times;</button>
                </div>
            </li>
        );
    }
}

class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        this.refs.itemName.focus();
    }
    onSubmit(event) {
        event.preventDefault();
        var newItemValue = this.refs.itemName.value.toLowerCase();

        if (newItemValue) {
            this.props.addItem({ newItemValue });
            this.refs.form.reset();
        }
    }

    render() {
        return (
            <form ref="form" onSubmit={this.onSubmit} className="form-inline">
                <input type="text" ref="itemName" className="form-control" placeholder="add a new todo..." />
                <button type="submit" className="btn btn-default glyphicon glyphicon-plus-sign"/>
            </form>
            
        );
    }
}

class TodoButtons extends React.Component {
    constructor(props) {
        super(props);
        this.onMarkAll = this.onMarkAll.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    onMarkAll() {
        for (let i = 0; i < todoItems.length; i++) {
            var index = parseInt(i);
            this.props.markAllDone(index);
        }
    }
    onSort() {
        this.props.sortItem(todoItems);
    }

    render() {
        return (
            <form ref="form" >
                <button type="button" className="btn btn-default glyphicon glyphicon-check" onClick={this.onMarkAll} />
                <button type="button" className="btn btn-default glyphicon glyphicon-sort" onClick={this.onSort} />
            </form>
            );
    }
}

class TodoHeader extends React.Component {
    render() {
        return <h1>Todo list</h1>;
    }
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.sortItem = this.sortItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.markTodoDone = this.markTodoDone.bind(this);
        this.markAllDone = this.markAllDone.bind(this);
        this.sortItem = this.sortItem.bind(this);
        this.state = { todoItems: todoItems };
    }
    addItem(todoItem) {
        todoItems.unshift({
            index: todoItems.length + 1,
            value: todoItem.newItemValue,
            done: false
        });
        this.setState({ todoItems: todoItems });
    }
    removeItem(itemIndex) {
        todoItems.splice(itemIndex, 1);
        this.setState({ todoItems: todoItems });
    }
    markTodoDone(itemIndex) {
        var todo = todoItems[itemIndex];
        todoItems.splice(itemIndex, 1);
        todo.done = !todo.done;
        todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
        this.setState({ todoItems: todoItems });
    }

    markAllDone(itemIndex) {
        var todo = todoItems[itemIndex];
        if (todo.done) {
            todoItems.splice(itemIndex, 1);
            todo.done = !todo.done;
            todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
        }
        this.setState({ todoItems: todoItems });
    }

    sortItem(todoItem) {
        todoItems = todoItems.sort((a, b) => (a.value > b.value) ? 1 : -1);
        this.setState({ todoItems: todoItems });
    }

    render() {
        return (
            <div id="main">
                <TodoHeader />
                <TodoForm addItem={this.addItem} />
                <TodoButtons markAllDone={this.markAllDone} sortItem={this.sortItem} />
                <TodoList items={this.props.initItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone} />
            </div>
        );
    }
}

ReactDOM.render(<TodoApp initItems={todoItems} />, document.getElementById('root'));


serviceWorker.unregister();
