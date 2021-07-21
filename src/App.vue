<template>
  <v-app>
    <v-main>
      <v-container>
        <ConnectWallet />
        <GasPrice />
        <CreateWallet />
        <WalletBalance />
        <TransferTokens />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ConnectWallet from '@/components/ui/ConnectWallet';
import GasPrice from '@/components/gas/Price';
import CreateWallet from '@/components/wallet/Create';
import WalletBalance from '@/components/wallet/Balance';
import TransferTokens from '@/components/wallet/Transfer';

export default {
  name: 'App',

  components: {
    ConnectWallet,
    GasPrice,
    CreateWallet,
    WalletBalance,
    TransferTokens,
  },

  data: () => ({}),
};
</script>
