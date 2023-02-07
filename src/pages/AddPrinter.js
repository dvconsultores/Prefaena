/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { Divider } from "react-native-elements";
import * as yup from "yup";
import { Formik } from "formik";
import { TextInputMask } from "react-native-masked-text";
import crud from "./Crud";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/FontAwesome";
import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";

//mac 00:22:58:02:11:E2

const inputStyle = {
  borderRadius: 5,
  borderWidth: 1,
  borderColor: "gray",
  padding: 12,
  color: "black",
  fontFamily: "Ubuntu",
  marginBottom: 5,
};

const AddPrinter = ({ route, navigation }) => {
  const [printid, setPrintId] = useState([]);

  //Default value for metodo
  async function SelectPrinterId() {
    let query = "select mac from Printer";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    //console.log(rows.length);
    if (selectQuery.rows.length > 0) {
      setPrintId(rows.item(0).mac);
    }
  }

  const InsertPrinter = (p1) => {
    crud.InsertPrinter(p1);
    SelectPrinterId();
  };

  function handleBackButtonClick() {
    //navigation.goBack();
    navigation.navigate("Menu");
    return true;
  }

  //Hook
  useEffect(() => {
    SelectPrinterId();

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);


  const connectDevice = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.connectDevice(printerSerial)
      .then((res) => {
        //do something with res
        //console.log("print: ", res);
        Alert.alert("Impresora emparejada", res);
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const enableBt = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.enableBluetooth()
      .then((res) => {
        //do something with res
        console.log("Bt: ", res);
      })
      .catch((error) => console.log(error.message));
  };

  const disableBt = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.disableBluetooth()
      .then((res) => {
        //do something with res
        console.log("Bt: ", res);
      })
      .catch((error) => console.log(error.message));
  };

  /*
  const scanDevice = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.scanDevices()
      .then((res) => {
        //do something with res
        console.log("scan: ", res);
      })
      .catch((error) => console.log(error.message));
  };*/

  return (
    <ScrollView style={styles.scrollView}>
      <Divider style={{ backgroundColor: "#FFF", height: 10 }} />
      <Grid>
        <Row size={2}>
          <Col>
            <TouchableOpacity
              style={styles.BtnEstatus}
              onPress={() => enableBt()}
            >
              <Text style={styles.btnText}>Act.Bt</Text>
              <Icon color="#00843D" name="bluetooth" size={25} />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              style={styles.BtnEstatus}
              onPress={() => disableBt()}
            >
              <Text style={styles.btnText}>Des.Bt</Text>
              <Icon color="#00843D" name="bluetooth-b" size={25} />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              style={styles.BtnEstatus}
              onPress={() => connectDevice()}
            >
              <Text style={styles.btnText}>Mostrar Imp</Text>
              <Icon color="#00843D" name="link" size={25} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
      <Divider style={{ backgroundColor: "#FFF", height: 10 }} />
      <Divider style={{ backgroundColor: "#FFD100", height: 5 }} />
      <Divider style={{ backgroundColor: "#FFF", height: 30 }} />
      <Text style={styles.text}>---Impresora {printid}---</Text>
      <Divider style={{ backgroundColor: "#FFF", height: 30 }} />
      <Formik
        enableReinitialize
        initialValues={{
          dt: "",
        }}
        onSubmit={(values) => InsertPrinter(values.dt)}
        validationSchema={yup.object().shape({
          dt: yup.string().required("Campo requerido!"),
        })}
      >
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <View style={styles.formContainer}>
            <Text>Agregar nueva Mac (Sólo AdministradoresP)</Text>
            <TextInputMask
              style={inputStyle}
              type={"custom"}
              placeholder="Agregar nueva Mac (Sólo AdministradoresP)"
              options={{
                /**
                 * mask: (String | required | default '')
                 * the mask pattern
                 * 9 - accept digit.
                 * A - accept alpha.
                 * S - accept alphanumeric.
                 * * - accept all, EXCEPT white space.
                 */
                mask: "SS:SS:SS:SS:SS:SS",
              }}
              value={values.dt}
              onChangeText={handleChange("dt")}
              onBlur={() => setFieldTouched("dt")}
            />
            {touched.dt && errors.dt && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.dt}
              </Text>
            )}
            <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
            <TouchableOpacity
              style={styles.loginBtn}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.loginText}>GUARDAR</Text>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "100%",
    width: "96%",
    marginLeft: "2%",
    fontFamily: "Ubuntu",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Ubuntu",
  },
  subtitle1: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Ubuntu",
  },
  loginBtn: {
    backgroundColor: "#00843D",
    borderRadius: 5,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  BtnEstatus: {
    backgroundColor: "#E6E1C5",
    borderRadius: 5,
    width: "99%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  BtnDetalle: {
    backgroundColor: "#012169",
    borderRadius: 5,
    height: 60,
    width: "99%",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  loginText: {
    color: "white",
  },
  btnText: {
    color: "black",
  },
  text: {
    fontFamily: "Ubuntu",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Ubuntu",
    textAlign: "center",
  },
  pickerStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    fontFamily: "Ubuntu",
    marginBottom: 5,
  },
});

export default AddPrinter;
