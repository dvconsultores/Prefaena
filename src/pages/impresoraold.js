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
} from "react-native";
import { ListItem, Divider } from "react-native-elements";
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

const Impresora = ({ navigation, route }) => {
  const [table, setTable] = useState([]);
  const [table1, setTable1] = useState([]);
  const [table2, setTable2] = useState([]);
  const [table3, setTable3] = useState([]);
  const [printid, setPrintId] = useState([]);

  //List medoto de recoleccion
  async function SelectTickets() {
    let query = "select *" +
    " , substr(FechaEntradaTransporte,1,2)||'D'||substr(FechaEntradaTransporte,4,2)||'D'||substr(FechaEntradaTransporte,9,2)||' '||substr(FechaEntradaTransporte,12,2)||'T'||substr(FechaEntradaTransporte,15,2)||'T00' as QRFechaEntradaTransporte" +
    " , substr(FechaSalidaTransporte,1,2)||'D'||substr(FechaSalidaTransporte,4,2)||'D'||substr(FechaSalidaTransporte,9,2)||' '||substr(FechaSalidaTransporte,12,2)||'T'||substr(FechaSalidaTransporte,15,2)||'T00' as QRFechaSalidaTransporte" +
    " , substr(FechaInicioRecepcion,1,2)||'D'||substr(FechaInicioRecepcion,4,2)||'D'||substr(FechaInicioRecepcion,9,2)||' '||substr(FechaInicioRecepcion,12,2)||'T'||substr(FechaInicioRecepcion,15,2)||'T00' as QRFechaInicioRecepcion" +
    " , substr(FechaFinalRecepcion,1,2)||'D'||substr(FechaFinalRecepcion,4,2)||'D'||substr(FechaFinalRecepcion,9,2)||' '||substr(FechaFinalRecepcion,12,2)||'T'||substr(FechaFinalRecepcion,15,2)||'T00' as QRFechaFinalRecepcion" +
    " , substr(FechaEntradaCuadrilla,1,2)||'D'||substr(FechaEntradaCuadrilla,4,2)||'D'||substr(FechaEntradaCuadrilla,9,2)||' '||substr(FechaEntradaCuadrilla,12,2)||'T'||substr(FechaEntradaCuadrilla,15,2)||'T00' as QRFechaEntradaCuadrilla" +
    " from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable(temp);
  }

  //List medoto de recoleccion
  async function SelectTicketsDetalle() {
    let query = "select * from TicketsDetalle where IdOrden = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.lote.split(" / ")[1],
    ]);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable1(temp);
  }

  //List medoto de recoleccion
  async function SelectTicketsEstatus() {
    let query =
      "select  case FLEstatus when 'EX' then 'Cancelado' when 'AB' then 'Abierto' else 'Cerrado' end FLEstatus, DesMotivoCancelacion from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable2(temp);
  }

  //List medoto de recoleccion
  async function SelectTicketsObservaciones() {
    let query =
      "select Observaciones, strftime('%Y/%m/%d %H:%M:%S','now') as hoy from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.ticket,
      route.params.lote.split(" / ")[0],
    ]);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable3(temp);
  }

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

  //Hook
  useEffect(() => {
    SelectTickets();
    SelectTicketsDetalle();
    SelectPrinterId();
    SelectTicketsEstatus();
    SelectTicketsObservaciones();
  }, []);

  const items = table1.map(
  (key) =>
    "Lote: " +
    key.IdOrden +
    "\r\n" +
    "Galpon: " +
    key.GalponReal +
    "\r\n" +
    "Nro. Jaulas: " +
    key.CantidadJaulasReal +
    "\r\n" +
    "Aves / Jaulas: " +
    key.TotalAnimalesReal +
    "\r\n" +
    "Total: " +
    key.AnimalesPJaulasReal +
    "\r\n" +
    "Retirada de alimento: " +
    key.FechaRetiradaAlimento 
);


const qritems = table1.map(
  (key) =>
    key.GalponReal + '%#G#%%' + key.AnimalesPJaulasReal + "%" + key.CantidadJaulasReal + "%%N%#F#"
);


  const print = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac

    const printerSerial = String(printid);  

   // var qrcode = "#2D%"+table[0].PlacaVehiculo
   // +"%"+table[0].NumTicket+"%"
    //+table[0].QRFechaEntradaTransporte+'%'
    //+table[0].QRFechaSalidaTransporte+'%'
    //+table[0].QRFechaInicioRecepcion+'%'
    //+table[0].QRFechaFinalRecepcion + "%"
    //+table[0].QRFechaEntradaCuadrilla + "%"
    //+table[0].DesCuadrilla+"%"+qritems;

    var cpcl =
      "! 0 200 200 1650 1\r\n" +
//      "B QR 500 200 M 2 U 10\r\n" +
//      "MA," + qrcode + "\n" +
//      "ENDQR\r\n" +
      "T 4 1 100 110 Ticket de recoleccion\r\n" +
      "TEXT 7 1 550 100 " + table3[0].hoy + "\r\n" +
      "ML 47\r\n"+
      "T 7 0 50 210\r\n" +
      "Nro.Ticket: " + table[0].NumTicket + "\r\n" +
      "Nro.Orden:: " + table[0].NumOrdenTrans + "\r\n" +
      "Granja: " + table[0].desGranja + "\r\n" +
      "Cuadrilla: " + table[0].DesCuadrilla + "\r\n" +
      "Consuctor: " + table[0].Conductor + "\r\n" +
      "Vehiculo: " + table[0].PlacaVehiculo + "\r\n" +
      "Metodo: " + table[0].IdMetodoRecolec + "\r\n" +
      "Llegada de cuadrilla: " + table[0].FechaEntradaCuadrilla + "\r\n" +
      "LLegada de vehiculo: " + table[0].FechaEntradaTransporte + "\r\n" +
      "Salida de vehiculo: " + table[0].FechaSalidaTransporte + "\r\n" +
      "Inicio de recoleccion: " + table[0].FechaInicioRecepcion + "\r\n" +
      "Salida de recoleccion: " + table[0].FechaFinalRecepcion + "\r\n" +
      "Estatus del ticket: " + table2[0].FLEstatus + "\r\n" +
      "Motivo: " + table2[0].DesMotivoCancelacion + "\r\n" +
    //  "Observaciones: " + table3[0].Observaciones + "\r\n".concat(items) + "\r\n" +
    //  "Firma de Transportista (C.I y Nombre):" +  "\r\n" +
    //  "Firma de Cuadrilla (C.I y Nombre):" +  "\r\n" +
    //  "Firma de Granjero (C.I y Nombre):" +  "\r\n" +
    //  "Firma de Prefaena (C.I y Nombre):" +  "\r\n" +
      "ENDML\r\n" +
      "PRINT\r\n";
   

      console.log(cpcl);           


    //const zpl = "^XA^FX Top section with company logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^ FO75,75 ^ FR ^ GB100, 100, 100 ^ FS^ FO88, 88 ^ GB50, 50, 50 ^ FS ^XZ";
    RNZebraBluetoothPrinter.print(printerSerial, cpcl)
      .then((res) => {
        //do something with res
        console.log("print: ", res);
        if (res == true) {
          Alert.alert("Mensaje", "Ticket impreso");
        }
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const connectDevice = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.connectDevice(printerSerial)
      .then((res) => {
        //do something with res
        console.log("print: ", res);
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
            <TouchableOpacity style={styles.BtnEstatus} onPress={() => print()}>
              <Text style={styles.btnText}>Imprimir</Text>
              <Icon color="#00843D" name="print" size={25} />
            </TouchableOpacity>
          </Col>
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
      
      {table.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Nro.Ticket: </Text>
              {item.NumTicket}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Nro.Orden: </Text>
              {item.NumOrdenTrans}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Granja: </Text>
              {item.desGranja}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Cuadrilla: </Text>
              {item.DesCuadrilla}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Consuctor: </Text>
              {item.Conductor}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Vehiculo: </Text>
              {item.PlacaVehiculo}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Método: </Text>
              {item.IdMetodoRecolec}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Llegada de cuadrilla: </Text>
              {item.FechaEntradaCuadrilla}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>LLegada de vehiculo: </Text>
              {item.FechaEntradaTransporte}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Salida de vehiculo: </Text>
              {item.FechaSalidaTransporte}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Inicio de recolección: </Text>
              {item.FechaInicioRecepcion}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Salida de recolección: </Text>
              {item.FechaFinalRecepcion}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      {table1.map((item1, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Lote: </Text>
              {item1.IdOrden}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Galpón: </Text>
              {item1.GalponReal}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Nro. Jaulas: </Text>
              {item1.CantidadJaulasReal}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Aves / Jaulas: </Text>
              {item1.TotalAnimalesReal}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Total: </Text>
              {item1.AnimalesPJaulasReal}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Fecha retiro alimento: </Text>
              {item1.FechaRetiradaAlimento}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      {table2.map((item2, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Estatus del ticket: </Text>
              {item2.FLEstatus}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Motivo: </Text>
              {item2.DesMotivoCancelacion}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      {table3.map((item3, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Observaciones: </Text>
              {item3.Observaciones}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
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

export default Impresora;
