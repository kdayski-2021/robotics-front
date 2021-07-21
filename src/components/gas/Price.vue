<template>
  <v-container>
    <v-data-table
      v-if="gasPrice"
      :headers="this.headers"
      :items="this.prices"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
    <v-btn elevation="2" color="primary" outlined @click="getGasPrices">
      {{ getGasPricesText }}
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'GasPrice',
  data: () => ({
    gasPrice: '',
    prices: [],
    headers: [
      { text: 'Price name', sortable: false, value: 'name' },
      { text: 'Price', sortable: true, value: 'price' },
    ],
    getGasPricesText: 'Get Gas Price',
  }),
  methods: {
    getGasPrices: async function() {
      this.$bia.connect(async () => {
        this.gasPrice = await this.$bia.getGasPrices();
        this.prices = Object.keys(this.gasPrice).map((priceName) => ({
          name: priceName,
          price: this.gasPrice[priceName],
        }));
        this.getGasPricesText = 'Update Gas Price';
      });
    },
  },
};
</script>

<style scoped></style>
