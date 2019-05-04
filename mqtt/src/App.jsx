import React, { Component } from 'react';
import './App.css';

import mqtt from 'mqtt';

class App extends Component {
  client;
  state = {
    currentId: '',
    active: '1',
    ids: [],
    doorsState: {}
  };

  constructor(props) {
    super(props);
    this.client = null;
  }

  handleChange = event => {
    event.persist();
    const name = event.target.name;

    if (!event.target.value) {
      return;
    }

    this.setState(prevState => ({ ...prevState, [name]: event.target.value }));
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.ids.length) {
      this.client.unsubscribe(this.state.ids);
    }

    const door = {
      topic: `tre2019/doors/${this.state.currentId}`,
      name: this.state.currentId.toUpperCase(),
      shouldBeOpen: +this.state.active
    };

    this.setState(
      prevState => ({
        currentId: '',
        ids: [...prevState.ids, door]
      }),
      () => this.state.ids.forEach(id => this.client.subscribe(id.topic))
    );
  };

  componentWillMount() {
    this.client = mqtt.connect('ws://test.mosquitto.org', {
      port: 8080,
      protocol: 'ws'
    });

    this.client.on('connect', () => console.log('connected'));

    this.client.on('message', (topic, message) => {
      this.setState(prevState => ({
        doorsState: { ...prevState.doorsState, [topic]: message.toString() }
      }));
    });
  }

  componentWillUnmount() {
    this.client.end();
  }

  render() {
    const { currentId, ids, doorsState, active } = this.state;

    return (
      <main className="main">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            onChange={this.handleChange}
            name="currentId"
            placeholder="ID"
            value={currentId}
          />
          <select name="active" value={active} onChange={this.handleChange}>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
          <button type="submit">Añadir</button>
        </form>

        <ul>
          {ids.map(id => (
            <li
              key={id.name}
              className={
                +doorsState[id.topic] === id.shouldBeOpen ? 'green' : 'red'
              }
            >
              {`${id.name} - Debe estar: ${
                id.shouldBeOpen === 1 ? 'Abierta' : 'Cerrada'
              }`}
            </li>
          ))}
        </ul>
      </main>
    );
  }
}

export default App;
