<template>
  <v-container>
    <v-btn
      elevation="2"
      v-if="!walletConnected"
      color="primary"
      outlined
      @click="connect"
    >
      Connect Wallet
    </v-btn>
    <v-btn elevation="2" v-else color="primary" outlined>
      {{ accountAddress }}
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'ConnectWallet',
  data: () => ({
    walletConnected: false,
    accountAddress: '',
  }),
  methods: {
    connect: async function() {
      this.$bia.connect(async (data) => {
        this.accountAddress = this.$bia.spliceAddress(data.address);
        this.walletConnected = data.success;
      });
    },
  },
};
</script>

<style scoped></style>
