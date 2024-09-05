import React, { useRef } from "react";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

export default function Payment() {
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/pay.png")} style={styles.image} />

      <Paystack
        paystackKey="pk_test_7953d775d4609d532c07d35f9a35760a7bde8d84"
        paystackSecretKey="sk_test_163f8586ac6f545f965ef8f133becacf365969bb"
        billingEmail="franciskontoh4@gmail.com"
        amount={1}
        billingName="Francis Kontoh"
        billingMobile="0592486117"
        currency="GHS"
        onCancel={(e) => {
          console.log(e);
        }}
        onSuccess={(res) => {
          console.log(res);
        }}
        ref={paystackWebViewRef}
      />
      <TouchableOpacity
        onPress={() => paystackWebViewRef.current.startTransaction()}
        style={styles.paystack}
      >
        <Text style={styles.pay}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  paystack: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: "60%",
    backgroundColor: "#F9A826",
    padding: 10,
    borderRadius: 15,
    marginBottom:100,
    marginRight:70
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 10,
    marginLeft:90
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: 550,
  },
  pay: {
    color: "white",
  },
});

