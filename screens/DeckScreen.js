import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { Card, Text, Button, Icon } from 'react-native-elements';

import Swipe from '../components/Swipe';
import * as actions from '../actions';

class DeckScreen extends Component {
  static navigationOptions = {
    title: 'Jobs',
    tabBarIcon: ({ tintColor }) => {
        return <Icon name="description" size={30} color={tintColor} />;
    }
  }

  renderCard(job) {
    const initialRegion = {
      longitude: job.longitude,
      latitude: job.latitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.02
    };
    
    return (
      <Card title={job.title}>
        <View style={{ height: 300 }}>
          <MapView
            scrollEnabled={false}
            style={{ flex: 1 }}
            cacheEnabled={Platform.OS === 'android'}
            initialRegion={initialRegion}
          />
        </View>
        <View style={styles.detailWrapper}>
          <Text>{job.company}</Text>
          <Text>{job.created_at}</Text>
        </View> 
        <Text>
          {job.description.replace(/<b>/g, '')
            .replace(/<\/b/g, '')
            .replace(/<br>/g, '')
            .replace(/<p>/g, '')
            .replace(/<\/p>/g, '')
            .replace(/\[/g, '')
            .replace(/\]/g, '')
            .replace(/<h3>/g, '')
            .replace(/<\/h3>/, '')
            .replace(/&/g, '')
            .replace(/<ul>/g, '')
            .replace(/<\/ul>/g, '')
            .replace(/<li>/g, '')
            .replace(/<\/li>/g, '')
            .replace(/<strong>/g, '')
            .replace(/<\/strong>/g, '')
          }
        </Text>
      </Card>
    );
  }

  renderNoMoreCards = () => {
    return (
      <Card title="No More Jobs">
        <Button
            title="Back To Map"
            large
            icon={{ name: 'my-location' }}
            backgroundColor="#03A9F4"
            onPress={() => this.props.navigation.navigate('map')}
        />
      </Card>

    );
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <Swipe
          data={this.props.jobs}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
          onSwipeRight={job => this.props.likeJob(job)}
          keyProp="id"
        />
      </View>
    );
  }
}

const styles = {
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  }
};

function mapStateToProps({ jobs }) {
  return { jobs };
}

export default connect(mapStateToProps, actions)(DeckScreen);
