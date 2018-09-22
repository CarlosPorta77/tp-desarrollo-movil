import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Constants, MapView, Location, Permissions } from "expo";
import { Ionicons } from "@expo/vector-icons";

export default class Map extends React.Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    toggleLocationEnabled: false
  };

  _handleClickGeolocation = () => {
    this.setState(state => {
      return { toggleLocationEnabled: !state.toggleLocationEnabled };
    });

    if (this.state.toggleLocationEnabled) {
      this._getLocationAsync();
      console.warn("pase por aca");
    }

    //console.warn(this.state.toggleLocationEnabled);
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  //   _handleMapRegionChange = mapRegion => {
  //     console.log(mapRegion);
  //     this.setState({ mapRegion });
  //   };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied"
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });

    // Center the map on the location we just fetched.
    this.setState({
      mapRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    });
  };

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
          <MapView
            style={StyleSheet.absoluteFill}
            region={this.state.mapRegion}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end"
              }}
            >
              <View style={{ backgroundColor: "green" }}>
                <TouchableOpacity onPress={this._handleClickGeolocation}>
                  <Ionicons name="ios-locate-outline" size={32} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          </MapView>
        )}
      </View>
    );
  }
}
