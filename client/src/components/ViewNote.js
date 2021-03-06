import React, { Component } from "react";
import EditIcon from "./EditIcon";
import DeleteIcon from "./DeleteIcon";
import CollapseIcon from "./CollapseIcon";
import NoteContainer from "./NoteContainer";
import TagButton from "./TagButton";
import AddTag from "./AddTag";
import EditNote from "./EditNote";


class ViewNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteId: this.props.noteId,
            active: false,
            collapse: false,
            edit: false
        };
    }
    handleActive = (prev) => {
        if (prev) {
            this.setState({ active: false, edit: false }, () => { console.log("child Prev"); console.log(this.state) })
        } else {
            this.setState({ active: true }, () => { console.log("child Current"); console.log(this.state) })
        }
    }
    handleCollapse = () => {
        let collapse = !this.state.collapse
        this.setState({ collapse })
    }
    recieveCollapseAll = (collapseAll) => {
        this.setState({ collapse: collapseAll })
    }
    handleEdit = () => {
        let edit = !this.state.edit
        console.log(edit)
        this.setState({ edit }, () => { console.log("handle edit"); console.log(this.state) })
    }
    render() {
        return (
            this.state.edit && this.state.active?
                <EditNote
                    activeNote={this.props.activeNote}
                    deleteOnClick={this.props.deleteOnClick}
                    bookmark={this.props.bookmark}
                    collapse={this.state.collapse}
                    keyword={this.props.keyword}
                    date={this.props.date}

                    tag={this.props.tag}

                    inputId={this.props.inputId}
                    callBackId={this.props.callBackId}
                    allTag={this.props.allTag}
                    userAllTag={this.props.userAllTag}

                    noteId={this.props.noteId}
                    handleEditSubmit={this.props.handleEditSubmit}
                    handleEditCancel={this.handleEdit}
                >
                </EditNote>

                :

                <div className="viewNoteContainer" onClick={this.props.handleActiveNote}>
                    <div className="colorPanel"
                        style={{
                            backgroundColor: this.state.active && "#f96738"
                        }}>
                    </div>
                    <div className="contentPanel">
                        <div className="iconPanel">
                            <CollapseIcon collapse={this.state.collapse} handleCollapse={this.handleCollapse}></CollapseIcon>
                            <EditIcon editOnClick={this.handleEdit}></EditIcon>
                            <DeleteIcon deleteIcon="far fa-trash-alt" deleteOnClick={this.props.deleteOnClick}></DeleteIcon>
                        </div>
                        <NoteContainer
                            bookmark={this.props.bookmark}
                            highlight={this.props.noteHighlight}
                            collapse={this.state.collapse}
                            keyword={this.props.keyword}
                            date={this.props.date}>
                        </NoteContainer>
                        {!this.state.collapse &&
                            <div className="tagContainer">
                                {this.props.tag.sort().map((tagEle, index) => (
                                    <TagButton
                                        key={index}
                                        text={tagEle}
                                        search={this.props.search}
                                        highlight={this.props.tagHighlight}
                                        edit={this.props.edit}
                                        deleteTag={this.props.deleteTag}>
                                    </TagButton>))}
                                <AddTag
                                    inputId={this.props.inputId}
                                    callBackId={this.props.callBackId}
                                    callback={this.props.callback}
                                    allTag={this.props.allTag}
                                    userAllTag={this.props.userAllTag}
                                    currentAllTag={this.props.tag}>
                                </AddTag>
                            </div>
                        }
                        <div style={{ clear: 'both' }}></div>
                    </div>
                </div>
        );
    }
}


export default ViewNote;