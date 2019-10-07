import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import _ from 'lodash';

// Hardcode cards. Code is agnostic to card imput to some extent - try changing the proportions of colors!
const BOARD = [
    "red", "red", "red", "red", "blue", "blue", "blue", "blue",
    "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow"
];

// Create a screen to render on
const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Memory Game'
})

// Add a way to quit from terminal
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: Date.now(),
            lastTime: Date.now(),
            cards: _.shuffle(BOARD),
            completed: new Set(),
            status: _.fill(Array(BOARD.length), false),
            guesses: 0,
            interval: setInterval(() => this.setState({ lastTime: Date.now() }), 100),
            gameOver: false
        }
    }

    handlePress = _.throttle((ind) => {
        let { cards, status, guesses, completed, interval } = this.state;
        // Cards that have been matched or are currently flipped shouldn't be flippable anymore
        if (completed.has(ind) || status[ind]) return;
        // Gets flipped, unmatched card if there is one and checks for match
        let flipped = _.head(_.range(BOARD.length).filter(ind => status[ind] && !completed.has(ind)));
        // Build board where all unmatched cards are unflipped
        status = _.range(BOARD.length).map(i => completed.has(i));
        if (typeof flipped !== 'undefined') {
            // Show both flipped cards, for now
            status[flipped] = true;
            status[ind] = true;
            if (cards[flipped] === cards[ind]) {
                completed.add(flipped);
                completed.add(ind);
                // Halt timer if every card has been matched
                if (_.every(_.range(BOARD.length), i => completed.has(i))) {
                    clearInterval(interval);
                    this.setState({ gameOver: true });
                    screen.key(['enter'], () => process.exit(0));
                }
            } else {
                guesses += 1;
                // Flip over both flipped cards
                setTimeout(() => 
                    this.setState({ status: _.range(status.length).map(i => completed.has(i)) }), 1000);
            }
        } else {
            // If only one card has been flipped, flip it!
            status[ind] = true;
        }
        this.setState({ ...this.state, status, guesses });
    }, { leading: true, trailing: false }).bind(this);

    render() {
        const { startTime, lastTime, cards, status, guesses, gameOver } = this.state;
        const time = ((lastTime - startTime) / 1000).toFixed(1);
        // Layout game board and messages
        return <box label="Memory" border={{ type: 'line' }} style={{ border: { fg: 'cyan' } }}>
            {
                cards.map((card, ind) =>
                    <Card 
                        key={`${ind}-${card}`} 
                        flipped={status[ind]} 
                        color={card} 
                        ind={ind} 
                        onPress={() => this.handlePress(ind)} 
                    />
                )
            }
            {
                gameOver ?
                    `Thank you for playing! Your time was ${time} secs, and you made ${guesses} incorrect guesses.`
                    + " Press escape to exit." :
                    `Time elapsed: ${time} secs. Incorrect guesses: ${guesses}`
            }
        </box >
    }
}

// Card presentationrender(<Game />, screen);al component
const Card = ({ onPress, flipped, color, ind }) => (
    <button
        mouse
        border={{ type: 'line' }}
        style={{
            border: {
                fg: flipped ? color : 'white'
            }
        }}
        height={'20%'}
        width={'7.5%'}
        left={`${(10 * (ind % 8)) + 11}%`}
        top={`${25 + 25 * _.floor(ind / 8)}%`}
        onPress={onPress}
    >
    </button>
);

// Render game in terminal!
render(<Game />, screen);
