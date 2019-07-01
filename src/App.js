import React, { Component, } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Nav, Card, Row, Col, Image, Button } from 'react-bootstrap';
import './App.css';
import { MdMailOutline } from "react-icons/md";
import { TiMessage, TiHeartOutline } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

      droplets: [],
      ifLoading: true,
      serachString: '',
     
    }
  }
  fetchdata() {
    var targetUrl = 'https://pepper-cloud-api.herokuapp.com/api/get?text=' + this.state.serachString

    fetch(targetUrl)
      .then(res => res.json())
      .then((droplets) => {
        this.setState({
          droplets: droplets,
          ifLoading: false
        })
      })
  }

  renderImage(droplets) {
    var entry;
    var name;
    var countIndices;
    var count;
    var entitiesCount;
    count = 0;
    countIndices = 0;
    entitiesCount = 0;
    entry = droplets.entities;
    for (name in entry) {
      ++entitiesCount;
    }
    entry = droplets.entities.media;
    for (name in entry) {
      ++count;
    }
    if (count > 0) {
      entry = droplets.entities.hashtags[0];
      for (name in entry) {
        ++countIndices;
      }
    }
    if (entitiesCount >= 1 && count >= 1) {
      return (
        <Card style={{ borderRadius: 15, borderWidth: 1, borderColor: "gray", margin: 10 }}>
          <Card.Img key={droplets.entities.media[0].media_url} style={{ borderRadius: 15, borderWidth: 1, borderColor: "gray" }} variant="top" src={droplets.entities.media[0].media_url} />
        </Card>

      )
    }
    else {
      return '';
    }
  }

  handleChange = e => {
    this.setState({ serachString: e.target.value });
  };
  renderIcons() {
    return (
      <Row style={{ paddingLeft: 5, margin: 5, marginTop: 30 }}>
        <TiMessage size={20} style={{ marginRight: '10%', color: 'grey' }} />
        <MdMailOutline size={20} style={{ marginRight: '10%', color: 'grey' }} />
        <TiHeartOutline size={20} style={{ marginRight: '10%', color: 'grey' }} />
      </Row>
    );
  }
  subComponent(droplets) {
 
    var rowOfText = [];
    var allText = droplets.text.split(' ');
    allText.forEach((e, i) => {
      if (e[0] === '#'|| e.slice(0, 7)==='https:/' ||e[0]==='@') {
        rowOfText.push(<Card.Text style={{ color: 'blue', fontSize: 15, padding: 0, margin: 0 }} key={i}>{e}</Card.Text>)
        rowOfText.push(<Card.Text key={i} style={{ whiteSpace: "pre", marginLeft:5, margin: 0 }} > </Card.Text>)
      } else if (e.toLowerCase() === this.state.serachString.toLowerCase()) {
        rowOfText.push(<Card.Text style={{ color: 'black', fontSize: 15, padding: 0, margin: 0, fontWeight: 'bold' }} key={i}>{e}</Card.Text>)
        rowOfText.push(<Card.Text key={i} style={{ whiteSpace: "pre", marginLeft:5, margin: 0 }} > </Card.Text>)
      }
      else {
        rowOfText.push(<Card.Text style={{ fontSize: 15, padding: 0, margin: 0 }} key={i}>{e}</Card.Text>)
        rowOfText.push(<Card.Text key={i} style={{ whiteSpace: "pre", marginLeft:5, margin: 0 }} > </Card.Text>)
      }
    });
    return rowOfText;

   
  }

  render() {
    if (this.state.ifLoading === false) {
      var rows = [];
      this.state.droplets.forEach((droplets) => {
        rows.push(
          <Card style={{ borderBottomColor: "gray", borderBottomWidth: 0, }}>
            <Row style={{ paddingLeft: 15, margin: 5 }}>
              <Image
                style={{
                  width: 60, height: 60,
                  borderRadius: 60 / 2,
                  borderColor: droplets.user.profile_sidebar_border_color, backgroundColor: "gray",
                  borderWidth: 1,
                  backgroundImage: "url(" + droplets.user.profile_image_url_https + ")"
                }}

              />

              <Col>

                <Row style={{ justifyContent: 'space-between' }}>
                  <Card.Text style={{ fontSize: 15, fontWeight: 'bold', padding: 0, margin: 0, paddingLeft: 15 }}>
                    {droplets.user.name}
                  </Card.Text>
                  <IoIosArrowDown style={{ fontSize: 20, padding: 0, margin: 0, color: 'grey' }} />
                </Row>
                <Card.Text style={{ fontSize: 15 }}>
                  @{droplets.user.screen_name}
                </Card.Text>

                <Row style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 0, paddingBottom: 0 }}>
                  {this.subComponent(droplets)}
                </Row>

                {this.renderImage(droplets)}
                {this.renderIcons()}
              </Col>
            </Row>
          </Card>
        );


      })
    }

    return (

      <div>
        <Navbar bg="white" variant="dark" sticky="top">
          <Nav className="mr-auto">
            <Nav.Link href="#home" style={{ color: 'black' }}>Home</Nav.Link>

          </Nav>
          <input type="text" placeholder="Search" style={
            {
              borderRadius: 20
            }
          }
            onChange={this.handleChange} value={this.state.serachString} />
          <button type="submit" onClick={this.fetchdata.bind(this)}>Submit</button>
        </Navbar>
        <br />
        <Navbar bg="primary" variant="dark" sticky="fixed" position="absolute">
          <Navbar.Brand href="#home" style={{ fontSize: 25 }}>{this.state.serachString}</Navbar.Brand>
          <Nav className="mr-auto">
          </Nav>
        </Navbar>

        <Card style={{ alignItems: 'center', backgroundColor: '#dce7f3' }}>

          <Card style={{ width: "40%", }}>
            {rows}
          </Card>
        </Card>


      </div>
    );
  }
}

export default App;