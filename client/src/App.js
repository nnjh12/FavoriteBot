import React, { Component } from "react";
import "./App.css";
import API from "./utils/api";

import { Col, Row, Container } from "./components/Grid";
import Logo from "./components/Logo"
import SearchBar from "./components/SearchBar";
import CollapseAllButton from "./components/CollapseAllButton";
import SortField from "./components/SortField";
import AddBookmark from "./components/AddBookmark";
import TagList from "./components/TagList";
import ViewNote from "./components/ViewNote";

class App extends Component {

  constructor(props) {
    super(props);
    this.collapseRef = [];
    this.state = {
      allNote: [],
      allTag: [],
      filteredNote: [],
      filteredTag: [],
      search1: "",
      search2: [],
      collapseAll: false,
      activeNote: ""
    };
  }

  componentDidMount() {
    this.loadNote();
  };

  loadNote = async () => {
    try {
      const allNote = await API.getAllNote();
      const allTag = await API.getAllTag();

      this.setState({ allNote: allNote.data, allTag: allTag.data }, () => {
        console.log(this.state)
        this.handleFilter(this.state.search1, this.state.search2)
      })
    } catch (err) {
      console.log(err)
    }
  };

  postNote = (newNote) => {
    // this.sortNote("date", false);
    console.log(newNote);
    API.saveNote(newNote)
      .then(res => {
        console.log("just saved")
        this.loadNote()
      })
      .catch(err => console.log(err));
  };

  deleteNote = (id) => {
    console.log("Delete")
    this.setState({activeNote:""})
    API.deleteNote(id)
      .then(this.loadNote)
      .catch(err => console.log(err));
  };

  editNote = (id, updatedNote) => {
    console.log(id, updatedNote);
    API.editNote(id, updatedNote)
      .then(this.loadNote)
      .catch(err => console.log(err));
  }

  testByInput = (note, input) => {
    const testKeyword = (str, key) => {
      return str.toLowerCase().indexOf(key) > -1;
    };
    const testTag = (arr, key) => {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().indexOf(key) > -1) {
          return true;
        }
      }
    };
    if (input === "") {
      return true;
    } else {
      if (input.charAt(0) === "#") {
        return testTag(note.tag, input.substr(1));
      } else {
        return testKeyword(note.bookmark, input) || testKeyword(note.keyword, input) || testTag(note.tag, input);
      }
    }
  };

  testByButton = (note, buttonArr) => {
    const testTagExactly = (arr, key) => {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === key) {
          return true;
        }
      }
    }
    if (buttonArr.length === 0) {
      return true;
    } else {
      return buttonArr.every(j => testTagExactly(note.tag, j));
    }
  };

  filterTag = (note) => {
    let filteredTag = [];
    for (let i = 0; i < note.length; i++) {
      for (let j = 0; j < note[i].tag.length; j++) {
        if (!filteredTag.includes(note[i].tag[j])) {
          filteredTag.push(note[i].tag[j])
        }
      }
    }
    this.setState({ filteredTag })
  };

  handleFilter = (search1, search2) => {
    let filteredNote = this.state.allNote.filter(ele => this.testByInput(ele, search1) && this.testByButton(ele, search2))
    this.setState({ filteredNote }, () => this.filterTag(this.state.filteredNote))
  };

  recieveSearch1 = (search1) => {
    this.setState({ search1 }, () => this.handleFilter(this.state.search1, this.state.search2))
  }

  recieveSearch2 = (search2) => {
    this.setState({ search2 }, () => this.handleFilter(this.state.search1, this.state.search2))
  }

  handleCollapseAll = () => {
    let collapseAll = !this.state.collapseAll
    this.setState({ collapseAll }, () => this.sendCollapseAll(this.collapseRef.length))
  }

  sendCollapseAll = (length) => {
    console.log(this.state.collapseAll)
    console.log(length)
    for (let i = 0; i < length; i++) {
      this.collapseRef[i].recieveCollapseAll(this.state.collapseAll)
    }
  }

  sortNote = (sortField, ascending) => {
    const sortAlphabet = (a, b) => {
      var noteA = a.keyword.toLowerCase(); // ignore upper and lowercase
      var noteB = b.keyword.toLowerCase(); // ignore upper and lowercase
      if (noteA < noteB) {
        return -1;
      }
      if (noteA > noteB) {
        return 1;
      }
      // names must be equal
      return 0;
    };
    const sortDate = (a, b) => {
      var dateA = a.date; // ignore upper and lowercase
      var dateB = b.date; // ignore upper and lowercase
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      // names must be equal
      return 0;
    };
    let sortedNote;
    if (sortField === "alphabet") {
      if (ascending) {
        sortedNote = this.state.allNote.sort(sortAlphabet)
      } else {
        sortedNote = this.state.allNote.sort(sortAlphabet).reverse()
      }
    } else {
      if (ascending) {
        sortedNote = this.state.allNote.sort(sortDate)
      } else {
        sortedNote = this.state.allNote.sort(sortDate).reverse()
      }
    }
    this.setState({ allNote: sortedNote }, () => { this.handleFilter(this.state.search1, this.state.search2) })
  };

  deleteTag = (id, tag) => {
    API.deleteTag(id, tag)
      .then(this.loadNote)
      .catch(err => console.log(err));
  };

  addTag = (id, newTag) => {
    API.addTag(id, newTag)
      .then(response => {
        console.log(response.data)
        this.loadNote()
      })
      .catch(err => console.log(err));
  };

  handleActiveNote = (id) => {
    if (this.state.activeNote === id) {
      return
    } else {
      this.setState((prevState) => {
        // console.log(prevState.activeNote);
        this.handleChildActive(prevState.activeNote, true)
        return {activeNote: id}
      }, () => {this.handleChildActive(this.state.activeNote, false)})
  
    }
  }
  handleChildActive = (id,prev) => {
    let current = this.collapseRef.filter(ele => ele.props.noteId === id);
    console.log(current)
    if (current.length===0) {
      return
    } else {
      current[0].handleActive(prev)
    }
  }
  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-2">
            <Logo></Logo>
          </Col>
          <Col size="md-10">
            <SearchBar
              sendSearch1={this.recieveSearch1}
              serach2={this.state.search2}>
            </SearchBar>
            <div className="menuIconContainer">
              <SortField handleSort={this.sortNote}></SortField>
              <CollapseAllButton collapseAll={this.state.collapseAll} handleCollapseAll={this.handleCollapseAll}></CollapseAllButton>
              <AddBookmark handleSubmit={this.postNote} userAllTag={this.state.allTag}></AddBookmark>
            </div>
          </Col>
        </Row>
        <Row>
          <Col size="md-2">
            <TagList
              sendSearch2={this.recieveSearch2}
              allTag={this.state.allTag}
              filteredTag={this.state.filteredTag}
              search1={this.state.search1}>
            </TagList>
          </Col>
          <Col size="md-10">
            {this.state.filteredNote.map((ele, index) => (
              <ViewNote
                ref={ref => (this.collapseRef[index] = ref)}
                key={ele._id}
                handleActiveNote={() => this.handleActiveNote(ele._id)}
                activeNote={this.state.activeNote}
                noteId={ele._id}
                bookmark={ele.bookmark}
                keyword={ele.keyword}
                noteHighlight={this.state.search1}
                date={ele.date}
                deleteOnClick={() => this.deleteNote(ele._id)}

                tag={ele.tag}
                search={this.state.search2}
                tagHighlight={this.state.search1.charAt(0) === "#" ? this.state.search1.substr(1) : this.state.search1}
                // deleteTag={() => this.deleteTag(ele._id, encodeURIComponent(tagEle))}

                inputId={`input${ele._id}`}
                callBackId={ele._id}
                callback={this.addTag}
                allTag={ele.tag}
                userAllTag={this.state.allTag}

                handleEditSubmit={this.editNote}
              >
              </ViewNote>
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
