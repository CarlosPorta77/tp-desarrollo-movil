import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';

export default class Map extends React.Component {

    state = {
        mapRegion: null,
        hasLocationPermissions: false,
        locationResult: null
      };

      _onPressGeo = ()=> {Console.log("HOLA")}

      componentDidMount() {
        this._getLocationAsync();
      }
    
    //   _handleMapRegionChange = mapRegion => {
    //     console.log(mapRegion);
    //     this.setState({ mapRegion });
    //   };
    
      _getLocationAsync = async () => {
       let { status } = await Permissions.askAsync(Permissions.LOCATION);
       if (status !== 'granted') {
         this.setState({
           locationResult: 'Permission to access location was denied',
         });
       } else {
         this.setState({ hasLocationPermissions: true });
       }
    
       let location = await Location.getCurrentPositionAsync({});
       this.setState({ locationResult: JSON.stringify(location) });
       
       // Center the map on the location we just fetched.
        this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
      };



      render() {
        return (
          <View style={ StyleSheet.absoluteFill }>
            
            {
             this.state.locationResult === null ?
              <Text>Finding your current location...</Text> :
               this.state.hasLocationPermissions === false ?
                 <Text>Location permissions are not granted.</Text> :
                 this.state.mapRegion === null ?
                 <Text>Map region doesn't exist.</Text> :
                <MapView style={ StyleSheet.absoluteFill }
                region={this.state.mapRegion}>
                <Button style= {styles.ButtonGeo} title="Geo" onPress={this._onPressGeo}/>

                </MapView>
                        
            
            }
          </View>
            
        );
      }
    }
    
    const styles = StyleSheet.create({
      paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'green',
      },
      ButtonGeo: {
        alignItems:'center'
      }
    });