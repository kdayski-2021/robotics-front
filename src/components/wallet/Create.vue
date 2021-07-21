<template>
  <v-container>
    <v-data-table
      v-if="walletAddress"
      :headers="this.headers"
      :items="this.items"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
    <v-btn elevation="2" color="primary" outlined @click="createWallet">
      {{ createWalletText }}
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'CreateWallet',
  data: () => ({
    createWalletText: 'Create Wallet',
    walletAddress: '',
    headers: [
      { text: 'Private Key', sortable: false, value: 'privateKey' },
      { text: 'Wallet Address', sortable: false, value: 'walletAddress' },
    ],
    items: [],
  }),
  methods: {
    createWallet: async function() {
      this.$bia.connect(async () => {
        const { walletAddress } = await this.$bia.createWallet();
        this.walletAddress = walletAddress;
        const wallets = this.$bia.web3.eth.accounts.wallet;
        this.items = [];
        for (let i = 0; i < wallets.length; i++) {
          this.items.push({
            privateKey: wallets[i].privateKey,
            walletAddress: wallets[i].address,
          });
        }
      });
    },
  },
};
</script>

<style scoped></style>
