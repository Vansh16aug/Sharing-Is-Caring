import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [payBill, setPayBill] = useState("user");

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(null);
  }
  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSetFriends(newfriend) {
    setFriends((friends) => [...friends, newfriend]);
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) => friend.id === selectedFriend.id ? {...friend,balance: friend.balance+value}:friend)
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSetSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleSetFriends} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          onSetSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
          bill={bill}
          onSetBill={setBill}
          myExpense={myExpense}
          onSetMyExpense={setMyExpense}
          payBill={payBill}
          setPayBill={setPayBill}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FormSplitBill({
  selectedFriend,
  bill,
  onSetBill,
  onSetMyExpense,
  myExpense,
  payBill,
  setPayBill,
  onSplitBill,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myExpense) return;

    onSplitBill(payBill === "user" ? paidByFriend : -myExpense);
    onSetBill("");
    onSetMyExpense("");
    setPayBill("");
  }

  const paidByFriend = bill ? bill - myExpense : "";

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill values</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      ></input>
      <label>🕴️ Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          onSetMyExpense(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
      ></input>

      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>

      <label>🤑 Who is paying the bill ?</label>
      <select value={payBill} onChange={(e) => setPayBill(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
function FriendList({ friends, onSetSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSetSelectedFriend={onSetSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSetSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSetSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}
