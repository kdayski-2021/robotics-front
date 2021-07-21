<template>
  <v-container>
    <div v-if="errorText">{{ errorText }}</div>
    <div v-if="walletBalance">{{ walletAddress }}: {{ walletBalance }} eth</div>
    <form>
      <v-text-field
        v-model="walletAddress"
        label="Wallet Address"
        @input="hideBalance"
      ></v-text-field>
      <v-btn
        class="mr-4"
        color="primary"
        outlined
        @click="getBalance(walletAddress)"
      >
        {{ walletBalanceText }}
      </v-btn>
    </form>
  </v-container>
</template>

<script>
export default {
  name: 'WalletBalance',
  data: () => ({
    walletAddress: '',
    walletBalanceText: 'Get Wallet Balance',
    walletBalance: '',
    errorText: '',
  }),
  methods: {
    hideBalance() {
      this.walletBalance = '';
    },
    async getBalance(walletAddress) {
      this.errorText = '';
      this.$bia.connect(async () => {
        this.walletBalance = await this.$bia.getBalance(walletAddress);
        if (!this.walletBalance) {
          this.errorText = 'Can not find wallet';
        }
      });
    },
  },
};
</script>

<style scoped></style>
