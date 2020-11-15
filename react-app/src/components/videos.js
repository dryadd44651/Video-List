import React, {Component} from 'react';
class Filtered extends Component {
  render () {
    return (
      <div>
        {this.props.videos.map((video,idx) => (
          <div key={idx} className="card">
            <div className="card-body">
              <h5 className="card-title">{video.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{video.genre}</h6>
              <p className="card-text">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    )}

}
class Videos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      filterText: '',
      videos:this.props.videos
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.matches = this.matches.bind(this);
  }

  matches(text, partial) {
    if(partial==='') return 1;
    return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({ filterText: this.state.inputText });
    
  }
  handleChange(e){
    //console.log( e.target.value)
    this.setState({ inputText: e.target.value });
  }
  render () {
    const rows = [];
    let videos = this.props.videos
    for(const i in videos){
      if(this.matches( videos[i].title,this.state.filterText))
        rows.push(videos[i]);
    }

    return (
      <div>
        <h1>Video List</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} />
          <input type="submit" value="search"></input>
        </form>
        <Filtered videos={rows} />

      </div>
    )}
}


export default Videos