import React from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { Constants, MapView, Location, Permissions } from 'expo'
import { Ionicons } from '@expo/vector-icons'
export default class Map extends React.Component {
  state = {
    mapRegion: {
      latitude: -34.59604245725726,
      longitude: -58.435411420148554,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    hasLocationPermissions: false,
    locationResult: {
      latitude: -34.59604245725726,
      longitude: -58.435411420148554,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    toggleLocationEnabled: true,
    coords: {},
  }

  positionCallback = position => {
    this.setState(state => {
      return {
        ...state,
        coords: position,
        mapRegion: {
          ...state.mapRegion,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      }
    })
  }

  _location = Location.watchPositionAsync({}, this.positionCallback)

  _handleClickGeolocation = () => {
    this._getLocationAsync()
  }

  _handleClickToggleFollowLocation = () => {
    console.warn(this.state.toggleLocationEnabled)
    if (this.state.toggleLocationEnabled) {
      this._location.remove(this.positionCallback)
    } else {
      _location = Location.watchPositionAsync({}, this.positionCallback)
    }

    this.setState(state => {
      return { toggleLocationEnabled: !this.state.toggleLocationEnabled }
    })
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      })
    } else {
      this.setState({ hasLocationPermissions: true })
    }

    let location2 = await Location.getCurrentPositionAsync({})
    this.setState({ locationResult: JSON.stringify(location2) })

    // Center the map on the location we just fetched.
    this.setState({
      mapRegion: {
        latitude: location2.coords.latitude,
        longitude: location2.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    })
  }

  componentDidMount() {
    this._getLocationAsync()
  }

  componentWillUnmount() {
    this._location.remove(this.positionCallback)
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        {this.state.locationResult === null ? (
          <Text>Finding your current location...</Text>
        ) : this.state.hasLocationPermissions === false ? (
          <Text>Location permissions are not granted.</Text>
        ) : this.state.mapRegion === null ? (
          <Text>Map region doesn't exist.</Text>
        ) : (
          <MapView style={StyleSheet.absoluteFill} region={this.state.mapRegion} showsUserLocation={true}>
            {/* <View style={styles.container}> */}
            <TouchableOpacity style={styles.ButtonGeo} onPress={this._handleClickToggleFollowLocation}>
              <Text style={styles.Icono}>
                {' '}
                <Ionicons name="ios-locate-outline" size={64} color="blue" />
              </Text>
            </TouchableOpacity>
            {/* </View> */}
          </MapView>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    ...StyleSheet.absoluteFillObject,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },

  ButtonGeo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',

    marginRight: 40,
  },
  Icono: {
    fontSize: 64,
  },
})
