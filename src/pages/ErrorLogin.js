import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";

const Menu = ({ route, navigation }) => {

  const [items, setItems] = React.useState([
    {
      name: "Ir al Menu",
      code: "#ff0000",
      navigate: "Menu",
      icon: "refresh",
      display: "true",
    },
  ]);

  const [load, setLoad] = useState(false);

  const inputStyle = {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    color: "black",
    fontFamily: "Ubuntu",
    marginBottom: 5,
  };

  function go(go) {
    setLoad(true);
    navigation.navigate(go);
    setTimeout(() => {
      setLoad(false);
    }, 3000);
  }
    const isMounted = React.useRef(true);
    //Hook
    useEffect(() => {
        //Generar las tablas si no existen
        if (isMounted.current) {
            // fetch data
            // setData (fetch result)
      
            return () => {
              isMounted.current = false;
            };
          }
        
      }, []);

  return (
    <FlatGrid
      itemDimension={180}
      data={items}
      style={styles.gridView}
      // staticDimension={300}
      // fixed
      spacing={10}
      renderItem={({ item }) => (
        <View
          style={[
            item.display == "true"
              ? styles.itemContainerA
              : styles.itemContainerB,
            { backgroundColor: item.code },
          ]}
          onStartShouldSetResponder={() => go(item.navigate)}
        >
          {load ? (
            <ActivityIndicator
              //visibility of Overlay Loading Spinner
              visible={load}
              //Text with the Spinner
              textContent={"Cargando..."}
              size="large"
              color="#00843D"
            />
          ) : (
            <TouchableOpacity
              onPress={() => go(item.navigate)}
              style={styles.itemName}
            >
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainerA: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemContainerB: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 150,
    display: "none",
  },
  itemName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
});

export default Menu;
