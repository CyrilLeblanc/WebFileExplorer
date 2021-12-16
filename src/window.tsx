import React from "react";
import Item from "./item";
import ModalRename from "./modalRename";

type IState = {
  title: string;
  currentPath: string;
  selected: string[];
  clipboard: IItem[];
  history: string[];
  items: IItem;
}

type IItem = {
  type: string;
  name: string;
  children?: IItem[];
}

class Window extends React.Component<any, IState> {
  modalRef: React.RefObject<any> = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      title: "WebFileExplorer",
      currentPath: "/",
      selected: [],
      clipboard: [],
      history: [],
      items: {
        type: "directory",
        name: "/",
        children: [
          {
            type: "directory",
            name: "Documents",
            children: [
              {
                type: "directory",
                name: "facture",
                children: [
                  { type: "file", name: "voiture.odt"},
                  { type: "file", name: "assurance.odt"},
                  { type: "file", name: "loyer.odt"},
                ],
              },
              {
                type: "directory",
                name: "administratif",
                children: [
                  { type: "file", name: "diplome.odt"},
                  { type: "file", name: "facture.odt"},
                ],
              },
              { type: "file", name: "id.odt"},
              { type: "file", name: "test.txt"},
            ],
          },
          {
            type: "directory",
            name: "Images",
            children: [
              {
                type: "directory",
                name: "vacance",
                children: [
                  { type: "file", name: "hawuai.jpeg"},
                  { type: "file", name: "bateau.jpg"},
                ],
              },
              { type: "file", name: "le chien.jpeg"},
            ],
          },
          {
            type: "directory",
            name: "Musics",
            children: [
              {
                type: "directory",
                name: "nirvana",
                children: [{ type: "file", name: "connaisPAS.mp3"}],
              },
            ],
          },
          { type: "file", name: "test.odt"},
        ],
      },
    };
  }

  /**
   * Allow the user to go back in directory tree
   */
  public goBack() {
    if (this.state.currentPath !== "/") {
      const element = this.state.currentPath.split("/");
      let history = this.state.history.slice();
      history.push(this.state.currentPath);
      element.splice(element.length - 2, 1);
      this.setState({
        currentPath: element.join("/"),
        history: history,
      });
    }
  }

  /**
   * Allow the user to go back where he was before before clicking the "back" button
   */
  public goNext() {
    if (this.state.history.length > 0) {
      this.setState({
        currentPath: this.state.history.pop() as string,
      });
    }
  }

  /**
   * put selected element in clipboard
   */
  public clickCopy() {
    let clipboard: IItem[] = [];
    this.state.selected.forEach((name) => {
      clipboard.push(this.getItem(name) as IItem);
    });
    this.unselectedAll();
    this.setState({ clipboard: clipboard });
  }

  /**
   * paste element in clipboard into current directory
   */
  public clickPaste() {
    let clipboard = this.state.clipboard.slice();
    clipboard.forEach((el) => {
      let alreadyPresent = false;
      (this.getCurrentDir().children as IItem[]).forEach((item) => {
        if (item.name === el.name) {
          alreadyPresent = true;
        }
      });
      if (!alreadyPresent) {
        (this.getCurrentDir().children as IItem[]).push(el);
      }
    });
    this.unselectedAll();
    this.forceUpdate();
  }

  /**
   * delete selected items in current directory
   */
  public clickDelete() {
    let children = this.getCurrentDir().children;
    this.state.selected.forEach((item) => {
      (children as IItem[]).splice(
        (children as IItem[]).findIndex((el) => {
          return el.name === item;
        }),
        1
      );
    });
    this.unselectedAll();
    this.forceUpdate();
  }

  /**
   * put the selected items in clipboard and delete them
   */
  public clickCut() {
    this.clickCopy();
    this.clickDelete();
  }

  /**
   * display the modal to show the user a prompt to select a new name
   */
  public clickRename() {
    if (this.state.selected.length > 0) {
      var str = this.state.selected.slice()[this.state.selected.length - 1];
      [].forEach.call(document.querySelectorAll(".selected"), (el: any) => {
        if (el.children[1].innerText !== str) {
          el.classList.remove("selected");
        }
      });
      this.setState({ selected: [str] });
      this.modalRef.current.setup(str);
      this.modalRef.current.ref.current.style.display = "flex";
    }
  }

  /**
   * rename the given element into what the user gave in the modal.
   */
  public rename(oldName: string, newName: string) {
    if (newName !== "") {
      (this.getCurrentDir().children as IItem[]).forEach((el, i) => {
        if (el.name === oldName) {
          el.name = newName;
        }
      });
      this.unselectedAll();
      this.forceUpdate();
    }
  }

  public clickNewFile() {
    (this.getCurrentDir().children as IItem[]).push({
      type: "file",
      name: "new_file",
    });
    this.forceUpdate();
  }

  public clickNewDirectory() {
    (this.getCurrentDir().children as IItem[]).push({
      type: "directory",
      name: "new_directory",
      children: [],
    });
    this.forceUpdate();
  }

  /**
   * unselect all selected item, remove .selected css style and from the state.selected
   */
  public unselectedAll() {
    this.setState({ selected: [] });
    [].forEach.call(document.querySelectorAll(".selected"), (el: any) => {
      el.classList.remove("selected");
    });
  }

  /**
   * return a reference of the current directory depending on the state.currentPath
   */
  public getCurrentDir() {
    const currentPath = ["/"].concat(this.state.currentPath.slice().split("/"));
    let items = this.state.items;
    currentPath.forEach((name: any) => {
      (items.children as IItem[]).forEach((dir) => {
        if (dir.type === "directory" && dir.name === name) {
          items = dir;
        }
      });
    });
    return items;
  }

  /**
   * return the item depending on the current directory and the name of the item
   */
  public getItem(name: string): IItem | void{
    let value: IItem = {type: "", name: ""};
    (this.getCurrentDir().children as IItem[]).forEach((item) => {
      if (item.name === name) {
        value = item;
      }
    });
    return value;
  }

  /**
   * return list of <Item> depending of the current directory
   */
  public getItems() {
    let items: any[] = [];
    (this.getCurrentDir().children as IItem[]).map((el: IItem) => {
      items.push(
        <Item
          name={el.name}
          type={el.type}
          click={this.clickItem.bind(this)}
          doubleClick={this.doubleClickItem.bind(this)}
        />
      );
      return null;
    });
    if (items.length === 0) {
      return <small>Empty Directory.</small>;
    }
    return items;
  }

  /**
   * handle SINGLE CLICK on items :
   * add or remove the element depending if it's already in state.selected and update appearance
   */
  public clickItem(name: string, ref: React.RefObject<any>) {
    const selected = this.state.selected.slice();
    ref.current.classList.toggle("selected");
    if (selected.indexOf(name) === -1) {
      selected.push(name);
    } else {
      selected.splice(selected.indexOf(name), 1);
    }
    this.setState({ selected: selected });
  }

  /**
   * handle DOUBLE CLICK on items:
   * allow user to go in the file that he double clicked
   */
  public doubleClickItem(name: string) {
    this.unselectedAll();
    this.setState({
      selected: [],
      currentPath: this.state.currentPath + name + "/",
      history: [],
    });
  }

  public render() {
    return (
      <div className="window">
        <div className="title-bar">
          <div className="title">{this.state.title}</div>
          <div className="control">
            <button>
              <img src="/icons/down.svg" alt="down" />
            </button>
            <button>
              <img src="/icons/expand.svg" alt="expand" />
            </button>
            <button>
              <img src="/icons/close.svg" alt="close" />
            </button>
          </div>
        </div>
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" value={this.state.currentPath} disabled />
            <div className="control">
              <button onClick={this.goBack.bind(this)} title="Back">
                <img src="/icons/back.svg" alt="back" />
              </button>
              <button onClick={this.goNext.bind(this)} title="Next">
                <img src="/icons/next.svg" alt="next" />
              </button>
            </div>
          </div>
          <div className="action">
            <button title="Copy" onClick={this.clickCopy.bind(this)}>
              <img src="/icons/copy.svg" alt="copy" />
            </button>
            <button title="Paste" onClick={this.clickPaste.bind(this)}>
              <img src="/icons/paste.svg" alt="paste" />
            </button>
            <button title="Delete" onClick={this.clickDelete.bind(this)}>
              <img src="/icons/delete.svg" alt="delete" />
            </button>
            <button title="Cut" onClick={this.clickCut.bind(this)}>
              <img src="/icons/cut.svg" alt="cut" />
            </button>
            <button title="Rename" onClick={this.clickRename.bind(this)}>
              <img src="/icons/rename.svg" alt="rename" />
            </button>
            <button title="new File" onClick={this.clickNewFile.bind(this)}>
              <img src="/icons/newFile.svg" alt="new File" />
            </button>
            <button
              title="new Directory"
              onClick={this.clickNewDirectory.bind(this)}
            >
              <img src="/icons/newDirectory.svg" alt="new Directory" />
            </button>
          </div>
        </div>
        <div className="content">{this.getItems()}</div>
        <ModalRename
          ref={this.modalRef}
          name={"test"}
          rename={this.rename.bind(this)}
        />
      </div>
    );
  }
}

export default Window;