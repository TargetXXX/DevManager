<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devs', function (Blueprint $table) {
            $table->id();
            $table->foreignId("nivel_id")->constrained("niveis")->restrictOnDelete();
            $table->string("nome");
            $table->char("sexo", 1);
            $table->date("data_nascimento");
            $table->string("hobby");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devs');
    }
};
