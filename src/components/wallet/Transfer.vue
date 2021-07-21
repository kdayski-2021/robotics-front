<template>
  <v-container>
    <form>
      <v-text-field v-model="to" label="To Address"></v-text-field>
      <v-text-field v-model="value" label="Amount of tokens"></v-text-field>
      <v-text-field v-model="gasPriceString" label="Gas Price"></v-text-field>
      <v-btn
        color="primary"
        outlined
        @click="transferTokens(to, value, gasPriceString)"
      >
        {{ transferTokensText }}
      </v-btn>
      <div class="pt-5">
        <v-btn
          class="mr-5"
          color="primary"
          outlined
          @click="depositTokens(to, value)"
        >
          {{ depositTokensText }}
        </v-btn>
        <v-btn color="primary" outlined @click="withdrawTokens(to, value)">
          {{ withdrawTokensText }}
        </v-btn>
      </div>
    </form>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ dialogText }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-actions>
          <v-btn
            :color="dialogColor"
            text
            @click="dialog = false"
            class="text-right"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'TransferTokens',
  data: () => ({
    transferTokensText: 'Transfer Tokens',
    depositTokensText: 'Stacking',
    withdrawTokensText: 'Unstacking',
    to: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    value: '0.3',
    gasPriceString: 'average',
    dialogText: '',
    dialog: false,
    dialogColor: 'primary',
  }),
  methods: {
    showDialog(text, color) {
      this.dialogText = text;
      this.dialogColor = color;
      this.dialog = true;
    },
    async transferTokens(to, value, gasPriceString) {
      this.$bia.connect(async () => {
        try {
          value = value.replace(',', '.');
          const transaction = await this.$bia.transferTokens(
            to,
            value,
            gasPriceString
          );
          transaction.status
            ? this.showDialog('Trasfer complete', 'primary')
            : this.showDialog('Trasfer errored', 'error');
        } catch (e) {
          this.showDialog(e, 'error');
        }
      });
    },
    async depositTokens(to, value) {
      this.$bia.connect(async () => {
        try {
          value = value.replace(',', '.');
          const transaction = await this.$bia.depositTokens(to, value);
          transaction.status
            ? this.showDialog('Trasfer complete', 'primary')
            : this.showDialog('Trasfer errored', 'error');
        } catch (e) {
          this.showDialog(e, 'error');
        }
      });
    },
    async withdrawTokens(to, value) {
      this.$bia.connect(async () => {
        try {
          value = value.replace(',', '.');
          const transaction = await this.$bia.withdrawTokens(to, value);
          transaction.status
            ? this.showDialog('Trasfer complete', 'primary')
            : this.showDialog('Trasfer errored', 'error');
        } catch (e) {
          this.showDialog(e, 'error');
        }
      });
    },
  },
};
</script>

<style scoped></style>
