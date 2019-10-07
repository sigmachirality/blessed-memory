# Memory

## Setup and Running
To run this game, you need a computer with a Node environment and yarn or npm installed. 
Clone this repository and run the following commands from the root of this repo in a terminal.
I used yarn in building this, so I recommend yarn, but npm works too I guess.
```
yarn install
yarn play
```
or
```
npm i
npm run play
```

## Rules
This is an implementation of Memory. Click on cards - up to two can be visible at a time. Continue matching cards
of the same color into pairs until no more cards remain. Try to get as low of a time and number of wrong guesses
as possible!

## Rationale

### Algorithm
I track cards by their index. I store their state in two arrays - status and cards. Cards contains, at each index,
what type/color of card that card is. Status contains whether the card is currently flipped up or down - if the
value at status[ind] is true, then the indth card is flipped up. The arrays are flat despite there being two rows
of cards, but it is fairly simple to calculate which card is in which row. I also track which cards have been matched
using a Set. 

### UI
In terms of design, I tried to make the layout responsive, using relative measurements to denote the height and
width of the cards. I decided to include a timer and a wrong count guesser because I felt that the game of 
memory by itself wasn't competitive enough - It's my hope that introducing these metrics will encourage people
to have their friends play this game too, in order to compare scores! It also helps with player retention, since
people will be motivated to try over and over to get the lowest possible time and misscounts.

### Tooling
I was aware of libraries like blessed, but hadn't worked much with them before. Therefore I ended up using
blessed-react, a blessed bindings package for Javascript that you write using React! Most of my experience comes
from React web development, so it was easy to get started and build this game. I recognize there are drawbacks to
relying on React wrappers (case in point, React Native's fall from grace in industry) but I just needed something
fairly quick and dirty yet also good enough to allow me to play around with the interface. blessed-react has 
lodash as an dependency so I also leverage some of its functionality to make the code look cleaner.

#### Packages used
For the full unabridged list, see the package.json.
- react
- blessed
- blessed-react
- lodash (aka _)
- babel
